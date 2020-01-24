import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { compareProducts } from '../helpers/compare-products';
import { IProductCategory } from '../interfaces/product--category.interface';
import { IProduct } from '../interfaces/product.interface';
import { StoreService } from './store.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private category$: BehaviorSubject<IProductCategory> = new BehaviorSubject(null);

    constructor(
        private storeService: StoreService
    ) { }

    public initCategory(id: string): void {
        this.category$.next(this.storeService.getProductCatalog(id));
    }

    public getCategory(): Observable<IProductCategory> {
        return this.category$.asObservable();
    }

    public addProduct(product: IProduct): Observable<unknown> {
        const category: IProductCategory = this.category$.value;
        const list: IProduct[] = [...category.list, product];
        list.sort(compareProducts);
        category.list = list;
        return this.storeService.renewProducts(category).pipe(
            tap(() => this.category$.next(category)),
        );
    }

    public editProduct(product: IProduct, index: number): Observable<unknown> {
        const category: IProductCategory = this.category$.value;
        const list: IProduct[] = [...category.list];
        list[index] = product;
        list.sort(compareProducts);
        category.list = list;

        return this.storeService.renewProducts(category).pipe(
            tap(() => this.category$.next(category)),
        );
    }

    public deleteProduct(index: number): Observable<unknown> {
        const category: IProductCategory = this.category$.value;
        const list: IProduct[] = [...category.list];
        list.splice(index, 1);
        category.list = list;

        return this.storeService.renewProducts(category).pipe(
            tap(() => this.category$.next(category)),
        );
    }
}
