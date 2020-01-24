import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../shared/shared.module';
import { CatalogPageComponent } from './catalog.page';
import { ManageProductComponent } from './product-list/manage-product/manage-product.component';
import { ProductListComponent } from './product-list/product-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {
                        path: '',
                        component: CatalogPageComponent
                    },
                    {
                        path: ':id',
                        component: ProductListComponent,
                    }
                ]
            }
        ]),
        SharedModule
    ],
    declarations: [
        CatalogPageComponent,
        ProductListComponent,
        ManageProductComponent,
    ],
    entryComponents: [
        ManageProductComponent,
    ]
})
export class CatalogModule { }
