import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { StoreDataRoutingModule } from './store-data-routing.module';
import { StoreDataComponent } from './store-data.component';

@NgModule({
    imports: [
        StoreDataRoutingModule,
        SharedModule,
    ],
    declarations: [StoreDataComponent]
})
export class StoreDataModule { }
