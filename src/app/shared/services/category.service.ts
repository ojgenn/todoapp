import { Injectable } from '@angular/core';

import { of, BehaviorSubject, Observable } from 'rxjs';

import { ICategory } from '../interfaces/category.interface';
import { StoreService } from './store.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private category$: BehaviorSubject<ICategory> = new BehaviorSubject(null);

    constructor(private storeService: StoreService) {
    }

    public initCategory(id: string): Observable<ICategory> {
        const category: ICategory = this.storeService.getCategory(id);
        this.category$.next(this.storeService.getCategory(id));
        return of(category);
    }

}
