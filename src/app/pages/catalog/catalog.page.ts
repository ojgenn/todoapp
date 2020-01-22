import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-list',
    templateUrl: 'catalog.page.html',
    styleUrls: ['catalog.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogPageComponent {

}
