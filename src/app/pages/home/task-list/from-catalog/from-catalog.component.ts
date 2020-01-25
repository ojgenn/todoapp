import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-from-catalog',
    templateUrl: './from-catalog.component.html',
    styleUrls: ['./from-catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FromCatalogComponent implements OnInit {

    constructor(private modalController: ModalController) { }

    ngOnInit(): void { }

    public close(): void {
        this.modalController.dismiss();
    }
}
