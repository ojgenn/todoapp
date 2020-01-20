import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { of, BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap, tap } from 'rxjs/operators';

import * as uuid from 'uuid';

import { CategoryStatus } from '../enums/category-status.enum';
import { compareCatalogsByTime } from '../helpers/compare-catalog-by-time';
import { STORE_NAME } from '../helpers/config.config';
import { sortCatalog } from '../helpers/sort-catalog';
import { ICategory } from '../interfaces/category.interface';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    private store$: BehaviorSubject<ICategory[]> = new BehaviorSubject([]);

    constructor(private storage: Storage) { }

    public initStore(): Observable<boolean> {
        return fromPromise(this.storage.get(STORE_NAME))
            .pipe(
                switchMap((categoryList: ICategory[]) => {
                    categoryList.sort(compareCatalogsByTime);
                    const modifiedCatalog: ICategory[] = sortCatalog(categoryList);
                    this.store$.next(sortCatalog(modifiedCatalog));

                    return of(true);
                }),
            );
    }

    public getCategoryList(): Observable<ICategory[]> {
        return this.store$.asObservable();
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
            status: CategoryStatus.NONE,
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
            catalog[index].status = CategoryStatus.DONE;
            catalog.sort(compareCatalogsByTime);
            const modifiedCatalog: ICategory[] = sortCatalog(catalog);
            return fromPromise(this.storage.set(STORE_NAME, modifiedCatalog)).pipe(
                tap(() => this.store$.next(modifiedCatalog))
            );
        }
        return of(EMPTY);
    }
}
