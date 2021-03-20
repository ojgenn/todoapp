import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

import { ModalController, NavParams, PickerController } from '@ionic/angular';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';

import { ETimeOptions } from '../../../../shared/enums/time-options.enum';
import { EUnits } from '../../../../shared/enums/units.enum';
import { FlatMap } from '../../../../shared/helpers/flat-map';
import { UNITS } from '../../../../shared/helpers/get-units';
import { IPickerOption } from '../../../../shared/interfaces/picker-option.interface';
import { ISelect } from '../../../../shared/interfaces/select.interface';
import { ITask } from '../../../../shared/interfaces/task.interface';
import { CategoryService } from '../../../../shared/services/category.service';
import { getNumberOptions } from './helpers/get-number-options';
import { getUnitOptions } from './helpers/get-unit-options';

@Component({
    selector: 'app-show-task',
    templateUrl: './show-task.component.html',
    styleUrls: ['./show-task.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowTaskComponent implements OnInit, OnDestroy {
    private readonly ngOnDestroy$: Subject<void> = new Subject();

    public readonly units: FlatMap<ISelect<EUnits>> = UNITS;
    public task: ITask;
    public fromLocalNotifications: boolean;

    constructor(
        private readonly modalController: ModalController,
        private readonly navParams: NavParams,
        private readonly pickerController: PickerController,
        private readonly translateService: TranslocoService,
        private readonly categoryService: CategoryService,
    ) {
    }

    ngOnInit(): void {
        this.task = this.navParams.get('task');
        this.fromLocalNotifications = this.navParams.get('fromLocalNotifications');
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    private putOffTask(value: Record<string, IPickerOption<string | ETimeOptions>>): void {
        let multiplication: number;
        switch (value?.unit?.value) {
            case ETimeOptions.MINUTE:
                multiplication = 60 * 1000;
                break;
            case ETimeOptions.HOUR:
                multiplication = 60 * 60 * 1000;
                break;
            case ETimeOptions.DAY:
                multiplication = 60 * 60 * 24 * 1000;
                break;
        }

        this.task.alertTime = +value.numbers.value * multiplication + Date.now();

        this.categoryService.editTask(this.task).pipe(
            takeUntil(this.ngOnDestroy$)
        ).subscribe(() => {
            this.modalController.dismiss();
        });
    }

    public close(): void {
        this.modalController.dismiss();
    }

    public async openPicker(): Promise<void> {
        const picker: HTMLIonPickerElement = await this.pickerController.create({
            buttons: [
                {
                    text: this.translateService.translate('buttons.CANCEL'),
                },
                {
                    text: this.translateService.translate('buttons.OK'),
                    handler: this.putOffTask.bind(this),
                },
            ],
            columns: [
                {
                    name: 'numbers',
                    options: getNumberOptions(),
                },
                {
                    name: 'unit',
                    options: getUnitOptions(this.translateService),
                },
            ]
        });
        await picker.present();
    }

}
