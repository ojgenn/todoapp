import { Component, OnInit } from '@angular/core';

import { ModalController, NavParams } from '@ionic/angular';

import { EUnits } from '../../../../shared/enums/units.enum';
import { FlatMap } from '../../../../shared/helpers/flat-map';
import { UNITS } from '../../../../shared/helpers/get-units';
import { ISelect } from '../../../../shared/interfaces/select.interface';
import { ITask } from '../../../../shared/interfaces/task.interface';

@Component({
    selector: 'app-show-task',
    templateUrl: './show-task.component.html',
    styleUrls: ['./show-task.component.scss'],
})
export class ShowTaskComponent implements OnInit {
    public task: ITask;
    public units: FlatMap<ISelect<EUnits>> = UNITS;

    constructor(
        private modalController: ModalController,
        private navParams: NavParams,
    ) { }

    ngOnInit(): void {
        this.task = this.navParams.get('task');
    }

    public close(): void {
        this.modalController.dismiss();
    }

}
