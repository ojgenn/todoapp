import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';

import { ITask } from '../interfaces/task.interface';

interface ICategoryContext<T> {
    appCategoryColor: T;
}

@Directive({
    selector: '[appCategoryColor]',
})
export class CategoryColorDirective<T> implements OnChanges {
    @Input() private appCategoryColor: { readonly: boolean; list: ITask[] };

    private context: ICategoryContext<{ color: string, actualTasks: number }> = { appCategoryColor: null };

    constructor(
        private readonly vcr: ViewContainerRef,
        private readonly templateRef: TemplateRef<ICategoryContext<{ color: string, actualTasks: number }>>,
    ) {
        this.vcr.createEmbeddedView(this.templateRef, this.context);
    }

    ngOnChanges(): void {
        let color: string = '';

        if (!this.appCategoryColor.readonly && this.appCategoryColor.list.length > 0 && this.appCategoryColor.list.every((task: ITask) => task.doneStatus === true)) {
            color = 'medium';
        }

        const actualTasks: number = this.appCategoryColor.list.filter((task: ITask) => !task.doneStatus).length;

        this.context.appCategoryColor = { color, actualTasks };
    }
}
