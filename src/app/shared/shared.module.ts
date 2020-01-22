import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslocoModule } from '@ngneat/transloco';

import * as directives from './directives';

@NgModule({
    declarations: [
        ...directives.list,
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslocoModule,
        ReactiveFormsModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslocoModule,
        ReactiveFormsModule,
        ...directives.list,
    ]
})
export class SharedModule {
}
