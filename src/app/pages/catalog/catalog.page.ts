import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IProductCategory } from '../../shared/interfaces/product--category.interface';
import { StoreService } from '../../shared/services/store.service';

@Component({
    selector: 'app-list',
    templateUrl: 'catalog.page.html',
    styleUrls: ['catalog.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogPageComponent implements OnInit {
    private willLeave$: Subject<void> = new Subject();

    public productsCatalog$: Observable<IProductCategory[]>;

    constructor(
        private storeService: StoreService,
        private platform: Platform,
    ) {
    }

    ngOnInit(): void {
        this.productsCatalog$ = this.storeService.getProducts();
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

    public trackByFn(_: number, item: IProductCategory): string {
        return item.id;
    }
}
