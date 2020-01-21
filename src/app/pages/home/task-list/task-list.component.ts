import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {IonItemSliding, ModalController} from '@ionic/angular';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { ICategory } from '../../../shared/interfaces/category.interface';
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

    public deleteTask(id: string): void {

    }

    public editTask(id: string, slidingItem: IonItemSliding): void {

    }

    public toggleDone(id: string, slidingItem: IonItemSliding): void {

    }
}
