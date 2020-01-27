import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../shared/shared.module';
import { TodayTasksPageRoutingModule } from './today-tasks-routing.module';
import { TodayTasksComponent } from './today-tasks.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TodayTasksPageRoutingModule,
        SharedModule,
    ],
    declarations: [TodayTasksComponent],
    providers: [
        DatePipe,
    ]
})
export class TodayTasksPageModule { }
