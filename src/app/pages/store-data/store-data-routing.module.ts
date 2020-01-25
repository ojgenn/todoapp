import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreDataComponent } from './store-data.component';

const routes: Routes = [
    {
        path: '',
        component: StoreDataComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StoreDataRoutingModule { }
