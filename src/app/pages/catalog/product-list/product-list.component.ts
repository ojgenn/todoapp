import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlertController, IonItemSliding, ModalController } from '@ionic/angular';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { IProductCategory } from '../../../shared/interfaces/product--category.interface';
import { IProduct } from '../../../shared/interfaces/product.interface';
import { ITask } from '../../../shared/interfaces/task.interface';
import { ProductService } from '../../../shared/services/product.service';
import { ManageProductComponent } from './manage-product/manage-product.component';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit, OnDestroy {
    private id: string;
    private ngOnDestroy$: Subject<void> = new Subject();

    public filterValue: string = '';
    public category$: BehaviorSubject<IProductCategory> = new BehaviorSubject(null);
    public filteredList$: BehaviorSubject<IProduct[]> = new BehaviorSubject([]);

    constructor(
        private alertController: AlertController,
        private route: ActivatedRoute,
        private modalController: ModalController,
        private productsService: ProductService,
        private translateService: TranslocoService,
    ) {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params.id;
        this.productsService.initCategory(this.id);
        this.productsService.getCategory().pipe(
            takeUntil(this.ngOnDestroy$),
        ).subscribe((category: IProductCategory) => {
            this.category$.next(category);
            this.filterApply(category);
        });
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    public async addProduct(): Promise<void> {
        const modal: HTMLIonModalElement = await this.modalController.create({
            component: ManageProductComponent,
            componentProps: {
                categoryId: this.id,
            }
        });
        await modal.present();
    }

    public async deleteProduct(index: number): Promise<void> {
        const alert: HTMLIonAlertElement = await this.alertController.create({
            header: `${this.translateService.translate('buttons.DELETE')}?`,
            buttons: [
                {
                    text: this.translateService.translate('buttons.CANCEL'),
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                    },
                }, {
                    text: this.translateService.translate('buttons.OK'),
                    handler: () => {
                        this.productsService.deleteProduct(index).pipe(
                            takeUntil(this.ngOnDestroy$),
                        ).subscribe();
                    }
                }
            ]
        });

        await alert.present();
    }

    public async editProduct(product: IProduct, index: number, slidingItem: IonItemSliding): Promise<void> {
        const modal: HTMLIonModalElement = await this.modalController.create({
            component: ManageProductComponent,
            componentProps: {
                categoryId: this.id,
                index,
                product,
            }
        });
        await modal.present();

        modal.onDidDismiss().then(() => {
            slidingItem.close();
        });
    }

    public trackByFn(_: number, item: ITask): string {
        return item.id;
    }

    public setFilterValue(event: CustomEvent): void {
        this.filterValue = event.detail.value;
        this.filterApply(this.category$.value);
    }

    private filterApply(productList: IProductCategory): void {
        this.filteredList$.next(productList.list.filter((product: IProduct) => (product.name.toUpperCase()).includes(this.filterValue.toUpperCase())));
    }

}
