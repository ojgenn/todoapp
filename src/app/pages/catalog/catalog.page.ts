import { ChangeDetectionStrategy, Component } from '@angular/core';

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
export class CatalogPageComponent {
    private readonly willLeave$: Subject<void> = new Subject();

    public readonly productsCatalog$: Observable<IProductCategory[]> = this.storeService.getProducts();

    constructor(
        private readonly storeService: StoreService,
        private readonly platform: Platform,
    ) {
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
