import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';

import { CategoryStatus } from '../enums/category-status.enum';

interface ICategoryContext<T> {
    appCategoryColor: T;
}

@Directive({
    selector: '[appCategoryColor]',
})
export class CategoryColorDirective<T> implements OnChanges {
    @Input() private appCategoryColor: { readonly: boolean; status: CategoryStatus };

    private context: ICategoryContext<string> = { appCategoryColor: null };

    constructor(
        private vcr: ViewContainerRef,
        private templateRef: TemplateRef<ICategoryContext<string>>,
    ) {
        this.vcr.createEmbeddedView(this.templateRef, this.context);
    }

    ngOnChanges(): void {
        let color: string = '';
        if (this.appCategoryColor.readonly) {
            color = 'warning';
        }

        if (this.appCategoryColor.status === CategoryStatus.DONE) {
            color = 'medium';
        }
        this.context.appCategoryColor = color;
    }
}
