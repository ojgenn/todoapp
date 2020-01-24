import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { IProductCategory } from '../../shared/interfaces/product--category.interface';
import { StoreService } from '../../shared/services/store.service';

@Component({
    selector: 'app-list',
    templateUrl: 'catalog.page.html',
    styleUrls: ['catalog.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogPageComponent implements OnInit {
    public productsCatalog$: Observable<IProductCategory[]>;

    constructor(private storeService: StoreService) {
    }

    ngOnInit(): void {
        this.productsCatalog$ = this.storeService.getProducts();
    }
}
