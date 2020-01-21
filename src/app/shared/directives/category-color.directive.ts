import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';

interface ICategoryContext<T> {
    appCategoryColor: T;
}

@Directive({
    selector: '[appCategoryColor]',
})
export class CategoryColorDirective<T> implements OnChanges {
    @Input() private appCategoryColor: { readonly: boolean; doneStatus: boolean };

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

        if (this.appCategoryColor.doneStatus) {
            color = 'medium';
        }
        this.context.appCategoryColor = color;
    }
}
