import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IonInput, ModalController, NavParams } from '@ionic/angular';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as uuid from 'uuid';

import { regex } from '../../../../shared/helpers/regex';
import { IProduct } from '../../../../shared/interfaces/product.interface';
import { ProductService } from '../../../../shared/services/product.service';

@Component({
    selector: 'app-manage-product',
    templateUrl: './manage-product.component.html',
    styleUrls: ['./manage-product.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageProductComponent implements OnInit, OnDestroy {
    @ViewChild('input', { static: true }) private input: IonInput;

    private readonly ngOnDestroy$: Subject<void> = new Subject();
    private product: IProduct;
    private categoryId: string;
    private index: number;

    public readonly errorMessage$: BehaviorSubject<string> = new BehaviorSubject(null);
    public form: FormGroup;

    constructor(
        private readonly modalController: ModalController,
        private readonly fb: FormBuilder,
        private readonly navParams: NavParams,
        private readonly productsService: ProductService,
    ) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: ['', [
                Validators.required,
                Validators.pattern(regex.safe),
            ]],
        });

        this.categoryId = this.navParams.get('categoryId');
        this.product = this.navParams.get('product');
        this.index = this.navParams.get('index');

        if (this.product) {
            this.form.setValue({
                name: this.product.name,
            });
        }
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    ionViewDidEnter(): void {
        this.input.setFocus();
    }

    private addProduct(form: FormGroup): void {
        const product: IProduct = {
            id: uuid.v4(),
            name: form.get('name').value,
        };

        this.productsService.addProduct(product).pipe(
            takeUntil(this.ngOnDestroy$),
        ).subscribe(() => this.modalController.dismiss());
    }

    private editProduct(form: FormGroup): void {
        const product: IProduct = {
            ...this.product,
            name: form.get('name').value,
        };

        this.productsService.editProduct(product, this.index).pipe(
            takeUntil(this.ngOnDestroy$),
        ).subscribe(() => this.modalController.dismiss());
    }

    public close(): void {
        this.modalController.dismiss();
    }

    public manage(form: FormGroup): void {
        if (this.product) {
            this.editProduct(form);
        } else {
            this.addProduct(form);
        }
    }
}
