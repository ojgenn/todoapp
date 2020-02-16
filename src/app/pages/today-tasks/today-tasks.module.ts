import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { TodayTasksPageRoutingModule } from './today-tasks-routing.module';
import { TodayTasksComponent } from './today-tasks.page';

@NgModule({
    imports: [
        TodayTasksPageRoutingModule,
        SharedModule,
    ],
    declarations: [TodayTasksComponent],
    providers: [
        DatePipe,
    ]
})
export class TodayTasksPageModule { }
