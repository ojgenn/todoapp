import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { IonInput, ModalController, NavParams } from '@ionic/angular';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { regex } from '../../../shared/helpers/regex';
import { ICategory } from '../../../shared/interfaces/category.interface';
import { StoreService } from '../../../shared/services/store.service';

@Component({
    selector: 'app-manage-catalog',
    templateUrl: './manage-catalog.component.html',
    styleUrls: ['./manage-catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageCatalogComponent implements OnInit, OnDestroy {
    @ViewChild('input', { static: true }) private input: IonInput;

    @Input() public category: ICategory;

    private readonly ngOnDestroy$: Subject<void> = new Subject();

    public readonly errorMessage$: BehaviorSubject<string> = new BehaviorSubject(null);
    public form: FormControl;

    constructor(
        private readonly modalController: ModalController,
        private readonly storeService: StoreService,
        private readonly translateService: TranslocoService,
        private readonly navParams: NavParams,
    ) { }

    ngOnInit(): void {
        const category: ICategory = this.navParams.get('category');

        this.form = new FormControl(category ? category.name : '',
            [
                Validators.required,
                Validators.pattern(regex.safe),
            ]
        );
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    ionViewDidEnter(): void {
        this.input.setFocus();
    }

    private save(form: FormControl): void {
        this.errorMessage$.next('');
        this.storeService.addCatalog(form.value).pipe(
            takeUntil(this.ngOnDestroy$),
        ).subscribe(() => this.modalController.dismiss(),
            () => this.errorMessage$.next(this.translateService.translate('errors.SAVE_ERR')));
    }

    private edit(form: FormControl): void {
        this.errorMessage$.next('');
        const category: ICategory = { ...this.navParams.get('category') };
        category.name = this.form.value;

        this.storeService.edit(this.navParams.get('category').id, form.value).pipe(
            takeUntil(this.ngOnDestroy$),
        ).subscribe(() => this.modalController.dismiss(),
            () => this.errorMessage$.next(this.translateService.translate('errors.SAVE_ERR')));
    }

    public close(): void {
        this.modalController.dismiss();
    }

    public manage(form: FormControl): void {
        if (this.navParams.get('category')) {
            this.edit(form);
        } else {
            this.save(form);
        }
    }
}
