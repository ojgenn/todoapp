import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AlertController, IonItemSliding, ModalController } from '@ionic/angular';

import { BehaviorSubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { EUnits } from '../../../shared/enums/units.enum';
import { PRODUCT_CATEGORY_ID } from '../../../shared/helpers/config.config';
import { FlatMap } from '../../../shared/helpers/flat-map';
import { UNITS } from '../../../shared/helpers/get-units';
import { ICategory } from '../../../shared/interfaces/category.interface';
import { ISelect } from '../../../shared/interfaces/select.interface';
import { ITask } from '../../../shared/interfaces/task.interface';
import { CategoryService } from '../../../shared/services/category.service';
import { AddMultiTaskComponent } from '../add-multi-task/add-multi-task.component';
import { FromCatalogComponent } from './from-catalog/from-catalog.component';
import { ManageTaskComponent } from './manage-task/manage-task.component';
import { ShowTaskComponent } from './show-task/show-task.component';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit, OnDestroy {
    private readonly ngOnDestroy$: Subject<void> = new Subject();
    private id: string;

    public readonly category$: BehaviorSubject<ICategory> = new BehaviorSubject(null);
    public readonly checkedTaskList$: BehaviorSubject<{ [key: string]: boolean }> = new BehaviorSubject({});
    public readonly units: FlatMap<ISelect<EUnits>> = UNITS;
    public readonly productCategoryId: string = PRODUCT_CATEGORY_ID;
    public isListEditable: boolean = false;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly categoryService: CategoryService,
        private readonly modalController: ModalController,
        private readonly alertController: AlertController,
        private readonly translateService: TranslocoService,
    ) {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params.id;
        this.categoryService.initCategory(this.id);
        this.getCategory();
        this.watchCategory();
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    private getCategory(): void {
        this.categoryService.getCategory().pipe(
            takeUntil(this.ngOnDestroy$)
        ).subscribe((category: ICategory) => this.category$.next(category));
    }

    private watchCategory(): void {
        this.category$.asObservable().pipe(
            map((category: ICategory) => category.list),
            take(1),
            takeUntil(this.ngOnDestroy$),
        ).subscribe(() => {
            const givenTaskData: Params = this.route.snapshot.queryParams;
            if (givenTaskData.hasOwnProperty('task')) {
                this.showTask(JSON.parse(givenTaskData['task']), true);
            }
        });
    }

    public async addTask(): Promise<void> {
        this.closeEditList();
        const modal: HTMLIonModalElement = await this.modalController.create({
            component: ManageTaskComponent,
            componentProps: {
                categoryId: this.id,
            }
        });
        await modal.present();
    }

    public async addMultiTasks(): Promise<void> {
        this.closeEditList();
        const modal: HTMLIonModalElement = await this.modalController.create({
            component: AddMultiTaskComponent,
            componentProps: {
                categoryId: this.id,
            }
        });
        await modal.present();
    }

    public async deleteTask(index: number): Promise<void> {
        this.closeEditList();
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
        this.closeEditList();
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

    public async showTask(task: ITask, fromLocalNotifications: boolean = false): Promise<void> {
        this.closeEditList();
        const modal: HTMLIonModalElement = await this.modalController.create({
            component: ShowTaskComponent,
            componentProps: {
                task,
                fromLocalNotifications,
            }
        });
        await modal.present();
    }

    public toggleDone(index: number, slidingItem: IonItemSliding): void {
        this.closeEditList();
        this.categoryService.toggleDone(index).pipe(
            takeUntil(this.ngOnDestroy$),
        ).subscribe(() => slidingItem.close());
    }

    public trackByFn(_: number, item: ITask): string {
        return item.id;
    }

    public async fromCatalog(): Promise<void> {
        this.closeEditList();
        const modal: HTMLIonModalElement = await this.modalController.create({
            component: FromCatalogComponent,
            componentProps: {
                category: this.category$.value,
            }
        });
        await modal.present();
    }

    public editList(): void {
        this.isListEditable = true;
    }

    public closeEditList(): void {
        this.isListEditable = false;
        this.checkedTaskList$.next({});
    }

    public manageTaskChecked(e: CustomEvent, task: ITask): void {
        const checked: boolean = e.detail.checked;
        const checkedTaskList: { [key: string]: boolean } = this.checkedTaskList$.value;
        if (checked) {
            checkedTaskList[task.id] = true;
        } else {
            delete checkedTaskList[task.id];
        }

        this.checkedTaskList$.next(checkedTaskList);
    }

    public manageAllList(): void {
        const checkedList: string[] = Object.keys(this.checkedTaskList$.value);
        if (checkedList.length === this.category$.value.list.length) {
            this.checkedTaskList$.next({});
        } else {
            const checkedTaskList: { [key: string]: boolean } = {};
            this.category$.value.list.forEach((item: ITask) => {
                checkedTaskList[item.id] = true;
            });

            this.checkedTaskList$.next(checkedTaskList);
        }
    }

    public getIconName(): string {
        const checkedList: string[] = Object.keys(this.checkedTaskList$.value);
        return checkedList.length === 0
            ? 'radio-button-off'
            : checkedList.length === this.category$.value.list.length ? 'radio-button-on' : 'remove-circle-outline';
    }

    public deleteFromList(): void {
        this.categoryService.deleteFromList(Object.keys(this.checkedTaskList$.value)).pipe(
            take(1),
        ).subscribe(() => this.closeEditList());
    }

    public markListDone(): void {
        this.categoryService.markAsDoneFromList(Object.keys(this.checkedTaskList$.value)).pipe(
            take(1),
        ).subscribe(() => this.closeEditList());
    }
}
