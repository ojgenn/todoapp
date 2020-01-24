import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonItemSliding, ModalController } from '@ionic/angular';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

    public category$: BehaviorSubject<IProductCategory> = new BehaviorSubject(null);

    constructor(
        private route: ActivatedRoute,
        private modalController: ModalController,
        private productsService: ProductService,
    ) {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params.id;
        this.productsService.initCategory(this.id);
        this.productsService.getCategory().pipe(
            takeUntil(this.ngOnDestroy$),
        ).subscribe((category: IProductCategory) => this.category$.next(category));
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

    public deleteProduct(index: number): void {

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

}
