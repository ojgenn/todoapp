import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../shared/shared.module';
import { StoreDataRoutingModule } from './store-data-routing.module';
import { StoreDataComponent } from './store-data.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        StoreDataRoutingModule,
        SharedModule
    ],
    declarations: [StoreDataComponent]
})
export class StoreDataModule { }
