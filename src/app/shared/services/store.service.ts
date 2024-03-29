import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ILocalNotification, LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { combineLatest, of, BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap, tap } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';
import * as uuid from 'uuid';

import { compareCatalogsByTime } from '../helpers/compare-catalog-by-time';
import { PRODUCTS_CATALOG_NAME, STORE_NAME } from '../helpers/config.config';
import { sortCatalog } from '../helpers/sort-catalog';
import { ICategory } from '../interfaces/category.interface';
import { IProductCategory } from '../interfaces/product--category.interface';
import { ITask } from '../interfaces/task.interface';
import { StoreType } from '../types/store.type';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    private readonly store$: BehaviorSubject<ICategory[]> = new BehaviorSubject([]);
    private readonly productsCatalog$: BehaviorSubject<IProductCategory[]> = new BehaviorSubject(null);

    constructor(
        private readonly storage: Storage,
        private readonly http: HttpClient,
        private readonly localNotification: LocalNotifications,
        private readonly translateService: TranslocoService,
        private readonly platform: Platform,
    ) {
    }

    private async renewNotifications(): Promise<void> {

        if (this.platform.is('android')) {
            const store: ICategory[] = [...this.store$.value];
            const schedules: ILocalNotification[] = [];
            const now: number = Date.now();
            let i: number = 0;

            await this.localNotification.clearAll();

            store.forEach((category: ICategory) => {
                category.list.forEach((task: ITask) => {
                    i++;
                    let text: string = task.name;
                    if (task.description) {
                        text += `\n${task.description}`;
                    }
                    if (task.alertTime && task.alertTime > now && !task.doneStatus) {
                        schedules.push({
                            id: i,
                            title: this.translateService.translate('app.NOTIFICATION'),
                            text,
                            launch: true,
                            data: task,
                            trigger: { at: new Date(task.alertTime) },
                            icon: 'https://ojgenn.github.io/img/todo.png',
                            actions: [
                                { id: 'click', title: this.translateService.translate('buttons.OPEN'), launch: true },
                                { id: 'close', title: this.translateService.translate('buttons.CLEAR') }
                            ]
                        });
                    }
                });
            });

            await this.localNotification.schedule(schedules);
        }
    }

    public initStore(): Observable<boolean> {

        if (this.platform.is('android')) {
            this.localNotification.setDefaults({
                vibrate: true,
            });
        }

        return fromPromise(this.storage.keys()).pipe(
            switchMap((keyList: string[]) => {
                if (keyList.includes(STORE_NAME) && keyList.includes(PRODUCTS_CATALOG_NAME)) {
                    return combineLatest([
                        fromPromise(this.storage.get(STORE_NAME)),
                        fromPromise(this.storage.get(PRODUCTS_CATALOG_NAME))
                    ]);
                }

                return combineLatest([
                    this.http.get('assets/jsons/store.json').pipe(
                        tap((categoryList: ICategory[]) => this.storage.set(STORE_NAME, categoryList))
                    ),
                    this.http.get('assets/jsons/food.json').pipe(
                        tap((productsCatalog: IProductCategory[]) => this.storage.set(PRODUCTS_CATALOG_NAME, productsCatalog))
                    )
                ]);
            })
        ).pipe(
            switchMap(([categoryList, productsCatalog]: StoreType) => {
                categoryList.sort(compareCatalogsByTime);
                const modifiedCatalog: ICategory[] = sortCatalog(categoryList);
                this.store$.next(sortCatalog(modifiedCatalog));
                this.productsCatalog$.next(productsCatalog);

                return of(true);
            }),
            tap(() => this.renewNotifications()),
        );
    }

    public getCategory(id: string): ICategory {
        return this.store$.value.find((category: ICategory) => category.id === id);
    }

    public addCatalog(name: string): Observable<unknown> {
        const category: ICategory = {
            id: uuid.v4(),
            name,
            readonly: false,
            created: Date.now(),
            list: [],
            doneStatus: false,
        };

        const catalog: ICategory[] = [...this.store$.value];
        catalog.push(category);
        catalog.sort(compareCatalogsByTime);
        const modifiedCatalog: ICategory[] = sortCatalog(catalog);

        return fromPromise(this.storage.set(STORE_NAME, modifiedCatalog)).pipe(
            tap(() => this.store$.next(modifiedCatalog))
        );
    }

    public edit(id: string, name: string): Observable<unknown> {
        const catalog: ICategory[] = [...this.store$.value];
        const index: number = catalog.findIndex((category: ICategory) => category.id === id);
        if (index) {
            catalog[index].name = name;
        }
        catalog.sort(compareCatalogsByTime);
        const modifiedCatalog: ICategory[] = sortCatalog(catalog);

        return fromPromise(this.storage.set(STORE_NAME, modifiedCatalog)).pipe(
            tap(() => this.store$.next(modifiedCatalog))
        );
    }

    public deleteCatalog(id: string): Observable<unknown> {
        const catalog: ICategory[] = [...this.store$.value];
        const index: number = catalog.findIndex((category: ICategory) => category.id === id);

        if (index >= 0) {
            catalog.splice(index, 1);
            return fromPromise(this.storage.set(STORE_NAME, catalog)).pipe(
                tap(() => this.store$.next(catalog))
            );
        }

        return of(EMPTY);
    }

    public markCatalogAsDone(id: string): Observable<unknown> {
        const catalog: ICategory[] = [...this.store$.value];
        const index: number = catalog.findIndex((category: ICategory) => category.id === id);

        if (index >= 0) {
            catalog[index].list = catalog[index].list.map((task: ITask) => {
                task.doneStatus = true;
                return task;
            });
            catalog.sort(compareCatalogsByTime);
            const modifiedCatalog: ICategory[] = sortCatalog(catalog);
            return fromPromise(this.storage.set(STORE_NAME, modifiedCatalog)).pipe(
                tap(() => this.store$.next(modifiedCatalog)),
                tap(() => this.renewNotifications()),
            );
        }

        return of(EMPTY);
    }

    public renewCategory(category: ICategory): Observable<unknown> {
        const catalog: ICategory[] = [...this.store$.value];
        const index: number = catalog.findIndex((item: ICategory) => item.id === category.id);
        if (index) {
            catalog[index] = category;
        }

        return fromPromise(this.storage.set(STORE_NAME, catalog)).pipe(
            tap(() => this.renewNotifications()),
            switchMap(() => of(EMPTY)),
        );
    }

    public getStore(): Observable<ICategory[]> {
        return this.store$.asObservable();
    }

    public getProducts(): Observable<IProductCategory[]> {
        return this.productsCatalog$.asObservable();
    }

    public getProductCatalog(id: string): IProductCategory {
        const productCatalog: IProductCategory[] = this.productsCatalog$.value;

        return productCatalog.find((category: IProductCategory) => category.id === id);
    }

    public renewProducts(category: IProductCategory): Observable<unknown> {
        const products: IProductCategory[] = this.productsCatalog$.value;
        const index: number = products.findIndex((item: IProductCategory) => item.id === category.id);
        if (index) {
            products[index] = category;
        }

        return fromPromise(this.storage.set(PRODUCTS_CATALOG_NAME, products)).pipe(
            switchMap(() => of(EMPTY)),
        );
    }

    public updateStore(store: ICategory[]): Observable<void> {
        this.store$.next(sortCatalog(store));
        return fromPromise(this.storage.set(STORE_NAME, store)).pipe(
            tap(() => this.renewNotifications()),
        );
    }

    public updateProducts(products: IProductCategory[]): Observable<void> {
        this.productsCatalog$.next(products);
        return fromPromise(this.storage.set(PRODUCTS_CATALOG_NAME, products));
    }
}
