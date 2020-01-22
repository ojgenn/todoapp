import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlertController, IonItemSliding, ModalController } from '@ionic/angular';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { ICategory } from '../../../shared/interfaces/category.interface';
import { ITask } from '../../../shared/interfaces/task.interface';
import { CategoryService } from '../../../shared/services/category.service';
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

    public editTask(id: string, slidingItem: IonItemSliding): void {

    }

    public async toggleDone(index: number, slidingItem: IonItemSliding): Promise<void> {
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
                        this.categoryService.toggleDone(index).pipe(
                            takeUntil(this.ngOnDestroy$),
                        ).subscribe(() => slidingItem.close());
                    }
                }
            ]
        });

        await alert.present();
    }

    public trackByFn(_: number, item: ITask): string {
        return item.id;
    }
}
