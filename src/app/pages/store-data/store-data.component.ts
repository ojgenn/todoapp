import { Component, OnDestroy, OnInit } from '@angular/core';

import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';

import { combineLatest, EMPTY, Subject } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap, takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { compareCatalogsByTime } from '../../shared/helpers/compare-catalog-by-time';
import { FlatMap } from '../../shared/helpers/flat-map';
import { sortCatalog } from '../../shared/helpers/sort-catalog';
import { ICategory } from '../../shared/interfaces/category.interface';
import { IProductCategory } from '../../shared/interfaces/product--category.interface';
import { StoreService } from '../../shared/services/store.service';
import { ToastService } from '../../shared/services/toast.service';
import { StoreType } from '../../shared/types/store.type';

interface IStoreProductsInterface {
    store: ICategory[];
    products: IProductCategory[];
}

@Component({
    selector: 'app-store-data',
    templateUrl: './store-data.component.html',
    styleUrls: ['./store-data.component.scss'],
})
export class StoreDataComponent implements OnInit, OnDestroy {
    private fileDir: string = this.file.dataDirectory;
    private fileName: string = 'catalog.json';
    private ngOnDestroy$: Subject<void> = new Subject();
    private willLeave$: Subject<void> = new Subject();

    constructor(
        private file: File,
        private storeService: StoreService,
        private toastService: ToastService,
        private translateService: TranslocoService,
        private platform: Platform,
    ) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    ionViewDidEnter(): void {
        this.platform.backButton.pipe(
            takeUntil(this.willLeave$),
        ).subscribe(() => {
            navigator['app'].exitApp();
        });
    }

    ionViewWillLeave(): void {
        this.willLeave$.next();
    }

    public save(): void {
        combineLatest([
            this.storeService.getStore(),
            this.storeService.getProducts(),
        ]).pipe(
            switchMap(([store, products]: StoreType) => {
                const data: IStoreProductsInterface = {
                    store,
                    products,
                };
                return fromPromise(this.file.writeFile(this.fileDir, this.fileName, JSON.stringify(data), { replace: true }));
            }),
            takeUntil(this.ngOnDestroy$),
        ).subscribe(() => this.toastService.show(this.translateService.translate('store-data.TOASTS.SAVED')),
            () => this.toastService.show(this.translateService.translate('errors.SAVE_ERR')));
    }

    public load(): void {
        fromPromise(this.file.readAsText(this.fileDir, this.fileName)).pipe(
            switchMap((data: string) => {
                if (data) {
                    const parsedData: IStoreProductsInterface = JSON.parse(data);
                    return combineLatest([
                        this.storeService.updateStore(parsedData.store),
                        this.storeService.updateProducts(parsedData.products),
                    ]);
                }
                return EMPTY;
            }),
            takeUntil(this.ngOnDestroy$),
        ).subscribe(() => this.toastService.show(this.translateService.translate('store-data.TOASTS.LOADED')),
            () => this.toastService.show(this.translateService.translate('errors.LOAD_ERR')));
    }

}
