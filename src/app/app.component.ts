import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppUpdate } from '@ionic-native/app-update/ngx';
import { ILocalNotification } from '@ionic-native/local-notifications';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoadingController, Platform } from '@ionic/angular';

import { combineLatest, forkJoin, of, Subject } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap, takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { ITask } from './shared/interfaces/task.interface';
import { StoreService } from './shared/services/store.service';
import { ToastService } from './shared/services/toast.service';

// tslint:disable-next-line:typedef
declare var cordova;

const UPDATE_URL: string = 'https://ojgenn.github.io/update/update.xml';

interface IAppPages {
    title: string;
    url: string;
    icon: string;
}

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    private ngOnDestroy$: Subject<void> = new Subject();
    private data: ITask;
    private localNotification$: Subject<void> = new Subject();
    private initialOver$: Subject<void> = new Subject();

    public appPages: IAppPages[];
    public version: string = '';

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private loadingController: LoadingController,
        private storeService: StoreService,
        private translateService: TranslocoService,
        private toastService: ToastService,
        private router: Router,
        private appUpdate: AppUpdate,
    ) {
    }

    ngOnInit(): void {
        this.appPages = AppComponent.initAppPages();
        this.initializeApp();
        this.watchLocalNotifications();
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    private watchLocalNotifications(): void {
        combineLatest([
            this.initialOver$.asObservable(),
            this.localNotification$.asObservable(),
        ]).pipe(
            takeUntil(this.ngOnDestroy$)
        ).subscribe(() => {
            if (this.data) {
                this.router.navigate(['home', this.data.parentId], { queryParams: { task: JSON.stringify(this.data) } });
            }
        });
    }

    private static initAppPages(): IAppPages[] {
        return [
            {
                title: 'side-menu.Home',
                url: '/home',
                icon: 'home-outline',
            },
            {
                title: 'side-menu.TODAY',
                url: '/today-tasks',
                icon: 'today-outline',
            },
            {
                title: 'side-menu.LIST',
                url: '/list',
                icon: 'list-outline',
            },
            {
                title: 'side-menu.STORE_DATA',
                url: '/store-data',
                icon: 'save-outline',
            }
        ];
    }

    private initStore(): void {
        this.translateService.selectTranslate('app.APP_INIT').pipe(
            switchMap((appMsg: string) => fromPromise(this.loadingController.create({
                message: appMsg,
            }))),
            switchMap((loading: HTMLIonLoadingElement) => {
                loading.present();
                return forkJoin([
                    of(loading),
                    this.storeService.initStore()
                ]);
            }),
            switchMap(([loading, _]: [HTMLIonLoadingElement, boolean]) => fromPromise(loading.dismiss())),
            takeUntil(this.ngOnDestroy$)
        ).subscribe(() => {
            this.initialOver$.next();
        }, () => this.toastService.show(this.translateService.translate('app.APP_INIT_ERR')));
    }

    public initializeApp(): void {
        this.platform.ready().then(() => {
            this.statusBar.styleLightContent();
            this.splashScreen.hide();

            if (this.platform.is('android')) {
                cordova.plugins.notification.local.on('click', (notification: ILocalNotification) => {
                    this.data = notification.data;
                    this.localNotification$.next();
                });

                this.appUpdate.checkAppUpdate(UPDATE_URL)
                    .finally(() => {
                        cordova.getAppVersion.getVersionNumber((version: string) => this.version = version);
                    });
            }

            this.initStore();
        });
    }

    public trackByFn(_: number, item: IAppPages): string {
        return item.url;
    }
}
