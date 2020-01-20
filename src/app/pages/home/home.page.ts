import { Component, OnDestroy, OnInit } from '@angular/core';

import { AlertController, IonItemSliding, ModalController } from '@ionic/angular';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { CategoryStatus } from '../../shared/enums/category-status.enum';
import { FlatMap } from '../../shared/helpers/flat-map';
import { ICategory } from '../../shared/interfaces/category.interface';
import { StoreService } from '../../shared/services/store.service';
import { ManageCatalogComponent } from './manage-catalog/manage-catalog.component';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
    private ngOnDestroy$: Subject<void> = new Subject();

    public categoryList$: BehaviorSubject<FlatMap<ICategory>> = new BehaviorSubject(null);
    public categoryStatus: typeof CategoryStatus = CategoryStatus;

    constructor(
        private alertController: AlertController,
        private modalController: ModalController,
        private storeService: StoreService,
        private translateService: TranslocoService,
    ) {
    }

    ngOnInit(): void {
        this.setCatalog();
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    private setCatalog(): void {
        this.storeService.getCategoryList().pipe(
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
        // tslint:disable-next-line:typedef
        const alert = await this.alertController.create({
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
        // tslint:disable-next-line:typedef
        const alert = await this.alertController.create({
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
