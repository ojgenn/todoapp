import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';

interface ILetContext<T> {
    appLet: T;
}

@Directive({
    selector: '[appLet]',
})
export class LetDirective<T> implements OnChanges {
    @Input() private appLet: T;

    private context: ILetContext<T> = { appLet: null };

    constructor(
        private readonly vcr: ViewContainerRef,
        private readonly templateRef: TemplateRef<ILetContext<T>>,
    ) {
        this.vcr.createEmbeddedView(this.templateRef, this.context);
    }

    ngOnChanges(): void {
        this.context.appLet = this.appLet;
    }
}
