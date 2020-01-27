import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TodayTasksComponent } from './today-tasks.page';

const routes: Routes = [
    {
        path: '',
        component: TodayTasksComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TodayTasksPageRoutingModule { }
