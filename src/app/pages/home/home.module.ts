import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { HomePageComponent } from './home.page';
import { ManageCatalogComponent } from './manage-catalog/manage-catalog.component';
import { FromCatalogComponent } from './task-list/from-catalog/from-catalog.component';
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
        FromCatalogComponent,
    ],
    entryComponents: [
        ManageCatalogComponent,
        ManageTaskComponent,
        FromCatalogComponent,
    ],
    providers: [
        DatePipe,
    ]
})
export class HomePageModule { }
