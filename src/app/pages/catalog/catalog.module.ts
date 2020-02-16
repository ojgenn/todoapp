import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { CatalogPageComponent } from './catalog.page';
import { ManageProductComponent } from './product-list/manage-product/manage-product.component';
import { ProductListComponent } from './product-list/product-list.component';

@NgModule({
    imports: [
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
        SharedModule,
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
