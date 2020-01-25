import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlertController, IonItemSliding, ModalController } from '@ionic/angular';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { EUnits } from '../../../shared/enums/units.enum';
import { PRODUCT_CATEGORY_ID, PRODUCTS_CATALOG_NAME } from '../../../shared/helpers/config.config';
import { FlatMap } from '../../../shared/helpers/flat-map';
import { UNITS } from '../../../shared/helpers/get-units';
import { ICategory } from '../../../shared/interfaces/category.interface';
import { ISelect } from '../../../shared/interfaces/select.interface';
import { ITask } from '../../../shared/interfaces/task.interface';
import { CategoryService } from '../../../shared/services/category.service';
import { FromCatalogComponent } from './from-catalog/from-catalog.component';
import { ManageTaskComponent } from './manage-task/manage-task.component';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit, OnDestroy {
    private id: string;
    private ngOnDestroy$: Subject<void> = new Subject();

    public category$: BehaviorSubject<ICategory> = new BehaviorSubject(null);
    public units: FlatMap<ISelect<EUnits>> = UNITS;
    public productCategoryId: string = PRODUCT_CATEGORY_ID;

    constructor(
        private route: ActivatedRoute,
        private categoryService: CategoryService,
        private modalController: ModalController,
        private alertController: AlertController,
        private translateService: TranslocoService,
    ) {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params.id;
        this.categoryService.initCategory(this.id);
        this.categoryService.getCategory().pipe(
            takeUntil(this.ngOnDestroy$)
        ).subscribe((category: ICategory) => this.category$.next(category));
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    public async addTask(): Promise<void> {
        const modal: HTMLIonModalElement = await this.modalController.create({
            component: ManageTaskComponent,
            componentProps: {
                categoryId: this.id,
            }
        });
        await modal.present();
    }

    public async deleteTask(index: number): Promise<void> {
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
                        this.categoryService.deleteTask(index).pipe(
                            takeUntil(this.ngOnDestroy$),
                        ).subscribe();
                    }
                }
            ]
        });

        await alert.present();
    }

    public async editTask(task: ITask, index: number, slidingItem: IonItemSliding): Promise<void> {
        const modal: HTMLIonModalElement = await this.modalController.create({
            component: ManageTaskComponent,
            componentProps: {
                categoryId: this.id,
                index,
                task,
            }
        });
        await modal.present();

        modal.onDidDismiss().then(() => {
            slidingItem.close();
        });
    }

    public toggleDone(index: number, slidingItem: IonItemSliding): void {
        this.categoryService.toggleDone(index).pipe(
            takeUntil(this.ngOnDestroy$),
        ).subscribe(() => slidingItem.close());
    }

    public trackByFn(_: number, item: ITask): string {
        return item.id;
    }

    public async fromCatalog(): Promise<void> {
        const modal: HTMLIonModalElement = await this.modalController.create({
            component: FromCatalogComponent,
            componentProps: {
                category: this.category$.value,
            }
        });
        await modal.present();
    }
}
