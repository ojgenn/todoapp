import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

import { AlertController, IonItemSliding, ModalController, Platform } from '@ionic/angular';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';
import * as uuid from 'uuid';

import { compareCatalogsByTime } from '../../shared/helpers/compare-catalog-by-time';
import { FlatMap } from '../../shared/helpers/flat-map';
import { sortCatalog } from '../../shared/helpers/sort-catalog';
import { ICategory } from '../../shared/interfaces/category.interface';
import { StoreService } from '../../shared/services/store.service';
import { ManageCatalogComponent } from './manage-catalog/manage-catalog.component';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit, OnDestroy {
    private readonly ngOnDestroy$: Subject<void> = new Subject();
    private readonly willLeave$: Subject<void> = new Subject();

    public readonly categoryList$: BehaviorSubject<FlatMap<ICategory>> = new BehaviorSubject(null);
    public mockArray: { num: number; id: string }[] = [];

    constructor(
        private readonly alertController: AlertController,
        private readonly modalController: ModalController,
        private readonly storeService: StoreService,
        private readonly translateService: TranslocoService,
        private readonly platform: Platform,
    ) {
    }

    ngOnInit(): void {
        this.setMockArray();
        this.setCatalog();
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    ionViewDidEnter(): void {
        const catalog: ICategory[] = this.categoryList$.value.asArray;
        catalog.sort(compareCatalogsByTime);
        const modifiedCatalog: ICategory[] = sortCatalog(catalog);
        this.categoryList$.next(new FlatMap<ICategory>(modifiedCatalog, 'id'));

        this.platform.backButton.pipe(
            takeUntil(this.willLeave$),
        ).subscribe(() => {
            navigator['app'].exitApp();
        });
    }

    ionViewWillLeave(): void {
        this.willLeave$.next();
    }

    private setMockArray(): void {
        Array.from(Array(4).keys()).forEach((item: number) => {
            this.mockArray.push({
                num: item,
                id: uuid.v4(),
            });
        });
    }

    private setCatalog(): void {
        this.storeService.getStore().pipe(
            takeUntil(this.ngOnDestroy$),
        ).subscribe((categoryList: ICategory[]) => {
            this.categoryList$.next(new FlatMap<ICategory>(categoryList, 'id'));
        });
    }

    public trackByFn(_: number, id: string): string {
        return id;
    }

    public async addCatalog(): Promise<void> {
        const modal: HTMLIonModalElement = await this.modalController.create({
            component: ManageCatalogComponent,
        });
        await modal.present();
    }

    public async deleteCategory(id: string): Promise<void> {
        const alert: HTMLIonAlertElement = await this.alertController.create({
            header: `${this.translateService.translate('buttons.DELETE')}?`,
            buttons: [
                {
                    text: this.translateService.translate('buttons.CANCEL'),
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                    },
                }, {
                    text: this.translateService.translate('buttons.OK'),
                    handler: () => {
                        this.storeService.deleteCatalog(id).pipe(
                            takeUntil(this.ngOnDestroy$),
                        ).subscribe();
                    }
                }
            ]
        });

        await alert.present();
    }

    public async markAsDone(id: string, slidingItem: IonItemSliding): Promise<void> {
        const alert: HTMLIonAlertElement = await this.alertController.create({
            header: this.translateService.translate('catalogs.MARK_AS_DONE'),
            buttons: [
                {
                    text: this.translateService.translate('buttons.CANCEL'),
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                    },
                }, {
                    text: this.translateService.translate('buttons.OK'),
                    handler: () => {
                        this.storeService.markCatalogAsDone(id).pipe(
                            takeUntil(this.ngOnDestroy$),
                        ).subscribe(() => slidingItem.close());
                    }
                }
            ]
        });

        await alert.present();
    }

    public async edit(category: ICategory, slidingItem: IonItemSliding): Promise<void> {
        const modal: HTMLIonModalElement = await this.modalController.create({
            component: ManageCatalogComponent,
            componentProps: {
                category,
            },
        });
        await modal.present();

        modal.onDidDismiss().then(() => {
            slidingItem.close();
        });
    }
}
