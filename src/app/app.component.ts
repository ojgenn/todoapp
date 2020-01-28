import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

    public appPages: { title: string; url: string; icon: string }[] = [
        {
            title: 'side-menu.Home',
            url: '/home',
            icon: 'home',
        },
        {
            title: 'side-menu.TODAY',
            url: '/today-tasks',
            icon: 'today',
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
        private router: Router,
    ) {
        this.initializeApp();
    }

    ngOnInit(): void {
        combineLatest([
            this.initialOver$.asObservable(),
            this.localNotification$.asObservable(),
        ]).subscribe(() => {
            if (this.data) {
                this.router.navigate(['home', this.data.parentId], { queryParams: { task: JSON.stringify(this.data) } });
            }
        });
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
            switchMap(([loading, _]: [HTMLIonLoadingElement, boolean]) => fromPromise(loading.dismiss())),
            takeUntil(this.ngOnDestroy$)
        ).subscribe(() => {
            this.initialOver$.next();
            // this.mockLoadingData();
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
            }
            this.initStore();
        });
    }

    // private mockLoadingData(): void {
    //     this.data = {
    //         alertTime: 1579987320000,
    //         created: 1579987342146,
    //         description: '',
    //         doneStatus: true,
    //         id: '4d65e94c-777a-4cbf-827d-22f9c03751ed',
    //         name: 'sdfdsf',
    //         parentId: 'bcf65074-d50f-4575-8760-196ff1c87015',
    //         qty: null,
    //         units: null,
    //     };
    //     this.localNotification$.next();
    // }
}
