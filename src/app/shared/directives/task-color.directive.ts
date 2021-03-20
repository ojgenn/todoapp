import { DatePipe } from '@angular/common';
import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';

import { ITask } from '../interfaces/task.interface';

interface ITaskContext<T> {
    appTaskColor: T;
}

@Directive({
    selector: '[appTaskColor]',
    providers: [DatePipe]
})
export class TaskColorDirective<T> implements OnChanges {
    @Input() private appTaskColor: { alertTime: number; doneStatus: boolean };

    private context: ITaskContext<string> = { appTaskColor: null };

    constructor(
        private readonly vcr: ViewContainerRef,
        private readonly templateRef: TemplateRef<ITaskContext<string>>,
        private readonly datePipe: DatePipe,
    ) {
        this.vcr.createEmbeddedView(this.templateRef, this.context);
    }

    ngOnChanges(): void {
        let color: string = '';
        if (this.appTaskColor.doneStatus) {
            color = 'medium';
        } else if (this.appTaskColor.alertTime) {
            const today: string = this.datePipe.transform(Date.now(), 'MM.dd.yyyy');
            const alertTime: string = this.datePipe.transform(this.appTaskColor.alertTime, 'MM.dd.yyyy');

            if (new Date(today).getTime() > new Date(alertTime).getTime()) {
                color = 'danger';
            } else if (new Date(today).getTime() === new Date(alertTime).getTime()) {
                color = 'warning';
            } else {
                color = 'success';
            }
        }

        this.context.appTaskColor = color;
    }
}
