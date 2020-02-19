import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ModalController, NavParams } from '@ionic/angular';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { FlatMap } from '../../../../shared/helpers/flat-map';
import { sortTaskList } from '../../../../shared/helpers/sort-tasks';
import { ICategory } from '../../../../shared/interfaces/category.interface';
import { IProductCategory } from '../../../../shared/interfaces/product--category.interface';
import { IProduct } from '../../../../shared/interfaces/product.interface';
import { ITask } from '../../../../shared/interfaces/task.interface';
import { CategoryService } from '../../../../shared/services/category.service';
import { StoreService } from '../../../../shared/services/store.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
    selector: 'app-from-catalog',
    templateUrl: './from-catalog.component.html',
    styleUrls: ['./from-catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FromCatalogComponent implements OnInit, OnDestroy {
    private ngOnDestroy$: Subject<void> = new Subject();
    private productsAsList: IProduct[] = [];
    private category: ICategory;

    public catalog$: BehaviorSubject<IProductCategory[]> = new BehaviorSubject([]);
    public expandedCategory: { [key: string]: boolean } = {};
    public form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private modalController: ModalController,
        private navParams: NavParams,
        private storeService: StoreService,
        private categoryService: CategoryService,
        private toastService: ToastService,
        private translateService: TranslocoService,
    ) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({});

        this.category = this.navParams.get('category');

        this.storeService.getProducts().pipe(
            takeUntil(this.ngOnDestroy$),
        ).subscribe((catalog: IProductCategory[]) => {
            this.catalog$.next(catalog);

            catalog.forEach((category: IProductCategory) => {
                category.list.forEach((product: IProduct) => {
                    const productIndexInCategory: number = this.category.list.findIndex((prod: ITask) => prod.id === product.id && !prod.doneStatus);
                    this.productsAsList.push(product);
                    this.form.addControl(product.id, new FormControl(productIndexInCategory >= 0));
                });
            });
        });
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    public close(): void {
        this.modalController.dismiss();
    }

    public trackByFn(_: number, item: IProductCategory | IProduct): string {
        return item.id;
    }

    public toggleCategory(id: string, flag: boolean): void {
        this.expandedCategory[id] = flag;
    }

    public save(form: FormGroup): void {
        const list: ITask[] = [...this.category.list];

        const listAsFlatMap: { [key: string]: ITask } = { ...new FlatMap<ITask>(list, 'id').map };

        this.productsAsList.forEach((product: ITask) => {

            if (form.value[product.id]) {
                product.created = Date.now();
                product.parentId = this.category.id;
                product.doneStatus = false;
                listAsFlatMap[product.id] = product;
            } else {
                if (listAsFlatMap[product.id]) {
                    delete listAsFlatMap[product.id];
                }
            }
        });

        const modifiedList: ITask[] = Object.values(listAsFlatMap);
        this.category.list = sortTaskList(modifiedList);

        this.storeService.renewCategory(this.category).pipe(
            takeUntil(this.ngOnDestroy$),
        ).subscribe(() => {
            this.categoryService.updateCategory(this.category);
            this.close();
        }, () => this.toastService.show(this.translateService.translate('errors.SAVE_ERR')));
    }

    public collapseAll(): void {
        this.expandedCategory = {};
    }
}
