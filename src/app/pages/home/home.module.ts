import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { HomePageComponent } from './home.page';
import { ManageCatalogComponent } from './manage-catalog/manage-catalog.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: HomePageComponent
            }
        ]),
        SharedModule,
    ],
    declarations: [
        HomePageComponent,
        ManageCatalogComponent,
    ],
    entryComponents: [
        ManageCatalogComponent,
    ],
})
export class HomePageModule { }
