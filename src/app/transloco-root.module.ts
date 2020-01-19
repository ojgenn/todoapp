import { HttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';

import { Observable } from 'rxjs';

import {
    translocoConfig,
    Translation,
    TranslocoLoader,
    TranslocoModule,
    TRANSLOCO_CONFIG,
    TRANSLOCO_LOADER
} from '@ngneat/transloco';

import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    constructor(private http: HttpClient) { }

    getTranslation(lang: string): Observable<Translation> {
        return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
    }
}

@NgModule({
    exports: [TranslocoModule],
    providers: [
        {
            provide: TRANSLOCO_CONFIG,
            useValue: translocoConfig({
                availableLangs: ['ru'],
                defaultLang: 'ru',
                // Remove this option if your application doesn't support changing language in runtime.
                reRenderOnLangChange: true,
                prodMode: environment.production,
            })
        },
        { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader }
    ]
})
export class TranslocoRootModule { }
