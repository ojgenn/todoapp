import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { HomePageComponent } from './home.page';
import { ManageCatalogComponent } from './manage-catalog/manage-catalog.component';
import { ManageTaskComponent } from './task-list/manage-task/manage-task.component';
import { TaskListComponent } from './task-list/task-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {
                        path: '',
                        component: HomePageComponent
                    },
                    {
                        path: ':id',
                        component: TaskListComponent,
                    }
                ]
            }
        ]),
        SharedModule,
    ],
    declarations: [
        HomePageComponent,
        ManageCatalogComponent,
        TaskListComponent,
        ManageTaskComponent,
    ],
    entryComponents: [
        ManageCatalogComponent,
        ManageTaskComponent,
    ],
})
export class HomePageModule { }
