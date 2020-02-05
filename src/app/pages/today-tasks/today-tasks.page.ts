import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Clipboard as IonClipboard } from '@ionic-native/clipboard';
import { ModalController, Platform } from '@ionic/angular';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { EUnits } from '../../shared/enums/units.enum';
import { FlatMap } from '../../shared/helpers/flat-map';
import { UNITS } from '../../shared/helpers/get-units';
import { ICategory } from '../../shared/interfaces/category.interface';
import { ISelect } from '../../shared/interfaces/select.interface';
import { ITask } from '../../shared/interfaces/task.interface';
import { StoreService } from '../../shared/services/store.service';
import { ToastService } from '../../shared/services/toast.service';
import { ShowTaskComponent } from '../home/task-list/show-task/show-task.component';

@Component({
    selector: 'app-today-tasks',
    templateUrl: './today-tasks.page.html',
    styleUrls: ['./today-tasks.page.scss'],
})
export class TodayTasksComponent implements OnInit, OnDestroy {
    private ngOnDestroy$: Subject<void> = new Subject();
    private willLeave$: Subject<void> = new Subject();

    public list$: BehaviorSubject<ITask[]> = new BehaviorSubject([]);
    public units: FlatMap<ISelect<EUnits>> = UNITS;
    public checkedTaskList$: BehaviorSubject<{ [key: string]: boolean }> = new BehaviorSubject({});
    public isListEditable: boolean = false;

    constructor(
        private platform: Platform,
        private storeService: StoreService,
        private datePipe: DatePipe,
        private modalController: ModalController,
        private translateService: TranslocoService,
        private toastService: ToastService,
    ) { }

    ngOnInit(): void {
        const simpleTasks: ITask[] = [];
        const alertTasks: ITask[] = [];
        const today: string = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

        this.storeService.getStore().pipe(
            takeUntil(this.ngOnDestroy$),
        ).subscribe((categories: ICategory[]) => {
            categories.forEach((category: ICategory) => {
                const list: ITask[] = category.list;

                list.forEach((task: ITask) => {
                    if (!task.doneStatus) {
                        if (!task.alertTime) {
                            simpleTasks.push(task);
                        } else if (task.alertTime && this.datePipe.transform(task.alertTime, 'yyyy-MM-dd') === today) {
                            alertTasks.push(task);
                        }
                    }
                });

            });
            this.list$.next([...alertTasks, ...simpleTasks]);
        });
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    ionViewDidEnter(): void {
        this.platform.backButton.pipe(
            takeUntil(this.willLeave$),
        ).subscribe(() => {
            navigator['app'].exitApp();
        });
    }

    ionViewWillLeave(): void {
        this.willLeave$.next();
    }

    public trackByFn(_: number, item: ITask): string {
        return item.id;
    }

    public async showTask(task: ITask): Promise<void> {
        const modal: HTMLIonModalElement = await this.modalController.create({
            component: ShowTaskComponent,
            componentProps: {
                task,
            }
        });
        await modal.present();
    }

    public async copy(): Promise<void> {
        const checked: string[] = Object.keys(this.checkedTaskList$.value);

        if (checked.length > 0) {
            const modifiedList: ITask[] = checked.map((id: string) => this.list$.value.find((task: ITask) => task.id === id));

            let text: string = this.translateService.translate('today.T') + '\n';
            modifiedList.forEach((item: ITask, index: number) => {
                const description: string = item.description ? `(${item.description})` : '';
                const qty: string = item.qty ? `, ${item.qty}` : '';
                const units: string = item.qty && item.units ? this.translateService.translate(`units.${EUnits[item.units]}`) : '';
                text += `${index + 1}) ${item.name} ${description} ${qty} ${units}\n`;
            });

            await IonClipboard.copy(text);
            this.toastService.show(this.translateService.translate('today.COPIED'));
        }

        this.isListEditable = false;
        this.checkedTaskList$.next({});
    }

    public getIconName(): string {
        const checkedList: string[] = Object.keys(this.checkedTaskList$.value);
        return checkedList.length === 0
            ? 'radio-button-off'
            : checkedList.length === this.list$.value.length ? 'radio-button-on' : 'remove-circle-outline';
    }

    public manageAllList(): void {
        const checkedList: string[] = Object.keys(this.checkedTaskList$.value);
        if (checkedList.length === this.list$.value.length) {
            this.checkedTaskList$.next({});
        } else {
            const checkedTaskList: { [key: string]: boolean } = {};
            this.list$.value.forEach((item: ITask) => {
                checkedTaskList[item.id] = true;
            });

            this.checkedTaskList$.next(checkedTaskList);
        }
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

    public startEdit(): void {
        this.isListEditable = true;
    }

    public stopEditList(): void {
        this.isListEditable = false;
        this.checkedTaskList$.next({});
    }
}
