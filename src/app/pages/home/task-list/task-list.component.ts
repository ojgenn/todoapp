import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { ICategory } from '../../../shared/interfaces/category.interface';
import { CatalogService } from '../../../shared/services/catalog.service';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
    private id: string;

    public category$: Observable<ICategory>;
    constructor(
        private route: ActivatedRoute,
        private catalogService: CatalogService,
    ) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.params.id;
        this.category$ = this.catalogService.initCategory(this.id);
    }

}
