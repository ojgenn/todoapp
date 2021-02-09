import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { AddMultiTaskComponent } from './add-multi-task/add-multi-task.component';
import { HomePageComponent } from './home.page';
import { ManageCatalogComponent } from './manage-catalog/manage-catalog.component';
import { FromCatalogComponent } from './task-list/from-catalog/from-catalog.component';
import { ManageTaskComponent } from './task-list/manage-task/manage-task.component';
import { CallablePipe } from './task-list/show-task/pipes/callable.pipe';
import { HtmlPipe } from './task-list/show-task/pipes/html.pipe';
import { TaskListComponent } from './task-list/task-list.component';

// tslint:disable-next-line:no-any
const entryComponents: any[] = [
    ManageCatalogComponent,
    ManageTaskComponent,
    FromCatalogComponent,
    AddMultiTaskComponent,
];

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
        TaskListComponent,
        ...entryComponents,
        HtmlPipe,
        CallablePipe,
    ],
    entryComponents: entryComponents,
    exports: [
        HtmlPipe,
        CallablePipe
    ],
    providers: [
        DatePipe,
    ]
})
export class HomePageModule { }
