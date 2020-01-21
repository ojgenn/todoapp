import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { Observable } from 'rxjs';

import { ICategory } from '../../../shared/interfaces/category.interface';
import { CategoryService } from '../../../shared/services/category.service';
import { ManageTaskComponent } from './manage-task/manage-task.component';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
    private id: string;

    public category$: Observable<ICategory>;
    constructor(
        private route: ActivatedRoute,
        private categoryService: CategoryService,
        private modalController: ModalController,
    ) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.params.id;
        this.category$ = this.categoryService.initCategory(this.id);
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
}
