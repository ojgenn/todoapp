import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EUnits } from '../../shared/enums/units.enum';
import { FlatMap } from '../../shared/helpers/flat-map';
import { UNITS } from '../../shared/helpers/get-units';
import { ICategory } from '../../shared/interfaces/category.interface';
import { ISelect } from '../../shared/interfaces/select.interface';
import { ITask } from '../../shared/interfaces/task.interface';
import { StoreService } from '../../shared/services/store.service';
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

    constructor(
        private platform: Platform,
        private storeService: StoreService,
        private datePipe: DatePipe,
        private modalController: ModalController,
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

}
