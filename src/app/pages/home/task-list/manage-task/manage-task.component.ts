import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IonInput, ModalController, NavParams } from '@ionic/angular';

import { combineLatest, BehaviorSubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';
import * as uuid from 'uuid';

import { getMonthNames } from '../../../../shared/helpers/month-names';
import { regex } from '../../../../shared/helpers/regex';
import { ITask } from '../../../../shared/interfaces/task.interface';
import { CategoryService } from '../../../../shared/services/category.service';

@Component({
    selector: 'app-manage-task',
    templateUrl: './manage-task.component.html',
    styleUrls: ['./manage-task.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageTaskComponent implements OnInit, OnDestroy {
    @ViewChild('input', { static: true }) private input: IonInput;

    private ngOnDestroy$: Subject<void> = new Subject();
    private categoryId: string;

    public errorMessage$: BehaviorSubject<string> = new BehaviorSubject(null);
    public form: FormGroup;
    public monthNames: string = getMonthNames();
    public maxYear: number;
    public currentYear: number;
    // tslint:disable-next-line:no-any
    public customOptions: any;

    constructor(
        private modalController: ModalController,
        private fb: FormBuilder,
        private translateService: TranslocoService,
        private navParams: NavParams,
        private categoryService: CategoryService,
    ) { }

    ngOnInit(): void {
        this.categoryId = this.navParams.get('categoryId');
        this.form = this.fb.group({
            name: ['', [
                Validators.required,
                Validators.pattern(regex.safe),
            ]],
            alertTime: [null],
            description: [null, [Validators.pattern(regex.safe)]]
        });

        this.currentYear = new Date().getFullYear();
        this.maxYear = this.currentYear + 50;

        this.setCustomOptions();
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    ionViewDidEnter(): void {
        this.input.setFocus();
    }

    private setCustomOptions(): void {
        combineLatest([
            this.translateService.selectTranslate('buttons.CLEAR'),
            this.translateService.selectTranslate('buttons.OK'),
            this.translateService.selectTranslate('buttons.CANCEL')
        ]).pipe(
            take(1),
        ).subscribe(([clear, ok, cancel]: string[]) => {
            this.customOptions = {
                buttons: [
                    {
                        text: clear,
                        handler: () => this.form.controls['alertTime'].setValue(null),
                    },
                    {
                        text: cancel,
                    },
                    {
                        text: ok,
                        // tslint:disable-next-line:typedef
                        handler: data => {
                            const year: string = data.year.value.toString();
                            const month: string = data.month.value < 10 ? '0' + data.month.value.toString() : data.month.value.toString();
                            const day: string = data.day.value.toString();
                            const date: string = `${year}-${month}-${day}T00:00:00Z`;
                            this.form.get('alertTime').setValue(date);
                        },
                    },
                ]
            };
        });
    }

    public close(): void {
        this.modalController.dismiss();
    }

    addTask(form: FormGroup): void {
        const alertTime: string = form.get('alertTime').value;
        const task: ITask = {
            id: uuid.v4(),
            name: form.get('name').value,
            created: Date.now(),
            alertTime: alertTime ? new Date(alertTime).getTime() : null,
            parentId: this.categoryId,
            doneStatus: false,
            description: form.get('description').value,
        };
        this.categoryService.addTask(task).pipe(
            takeUntil(this.ngOnDestroy$)
        ).subscribe(() => {
            this.modalController.dismiss();
        });
    }

    public manage(form: FormGroup): void {
        this.addTask(form);
    }
}
