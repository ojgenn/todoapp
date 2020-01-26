import { Component, OnDestroy } from '@angular/core';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoadingController, Platform } from '@ionic/angular';

import { forkJoin, of, Subject } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap, takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { StoreService } from './shared/services/store.service';
import { ToastService } from './shared/services/toast.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy {
    private ngOnDestroy$: Subject<void> = new Subject();

    public appPages: { title: string; url: string; icon: string }[] = [
        {
            title: 'side-menu.Home',
            url: '/home',
            icon: 'home',
        },
        {
            title: 'side-menu.LIST',
            url: '/list',
            icon: 'list',
        },
        {
            title: 'side-menu.STORE_DATA',
            url: '/store-data',
            icon: 'save',
        }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private loadingController: LoadingController,
        private storeService: StoreService,
        private translateService: TranslocoService,
        private toastService: ToastService,
    ) {
        this.initializeApp();
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    private initStore(): void {
        this.translateService.selectTranslate('app.APP_INIT').pipe(
            switchMap((appMsg: string) => fromPromise(this.loadingController.create({
                message: this.translateService.translate(appMsg),
            }))),
            switchMap((loading: HTMLIonLoadingElement) => {
                loading.present();
                return forkJoin([
                    of(loading),
                    this.storeService.initStore()
                ]);
            }),
            takeUntil(this.ngOnDestroy$)
        ).subscribe(([loading, _]: [HTMLIonLoadingElement, boolean]) => {
            loading.dismiss();
        }, () => this.toastService.show(this.translateService.translate('app.APP_INIT_ERR')));
    }

    public initializeApp(): void {
        this.platform.ready().then(() => {
            this.statusBar.styleLightContent();
            this.splashScreen.hide();
            this.initStore();
        });
    }
}
