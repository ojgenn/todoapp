import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { ModalController } from '@ionic/angular';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { regex } from '../../../shared/helpers/regex';
import { StoreService } from '../../../shared/services/store.service';

@Component({
    selector: 'app-manage-catalog',
    templateUrl: './manage-catalog.component.html',
    styleUrls: ['./manage-catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageCatalogComponent implements OnInit, OnDestroy {
    private ngOnDestroy$: Subject<void> = new Subject();

    public errorMessage$: BehaviorSubject<string> = new BehaviorSubject(null);
    public form: FormControl;

    constructor(
        private modalController: ModalController,
        private storeService: StoreService,
        private translateService: TranslocoService,
    ) { }

    ngOnInit(): void {
        this.form = new FormControl('',
            [
                Validators.required,
                Validators.pattern(regex.safe),
            ]
        );
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    private save(form: FormControl): void {
        this.errorMessage$.next('');
        this.storeService.addCatalog(form.value).pipe(
            takeUntil(this.ngOnDestroy$),
        ).subscribe(() => this.modalController.dismiss(),
            () => this.errorMessage$.next(this.translateService.translate('errors.SAVE_ERR')));
    }

    public close(): void {
        this.modalController.dismiss();
    }

    public manage(form: FormControl): void {
        this.save(form);
    }
}
