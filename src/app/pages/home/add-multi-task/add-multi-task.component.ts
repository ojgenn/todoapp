import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IonInput, ModalController, NavParams } from '@ionic/angular';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as uuid from 'uuid';

import { regex } from '../../../shared/helpers/regex';
import { ITask } from '../../../shared/interfaces/task.interface';
import { CategoryService } from '../../../shared/services/category.service';

@Component({
    selector: 'app-add-multi-task',
    templateUrl: './add-multi-task.component.html',
    styleUrls: ['./add-multi-task.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMultiTaskComponent implements OnInit, OnDestroy {
    @ViewChild('input', { static: true }) private input: IonInput;

    private readonly ngOnDestroy$: Subject<void> = new Subject();
    private categoryId: string;

    // TODO: unusable. fix it
    public readonly errorMessage$: BehaviorSubject<string> = new BehaviorSubject(null);
    public form: FormGroup;

    constructor(
        private readonly modalController: ModalController,
        private readonly fb: FormBuilder,
        private readonly navParams: NavParams,
        private readonly categoryService: CategoryService,
    ) { }

    ngOnInit(): void {
        this.categoryId = this.navParams.get('categoryId');
        this.form = this.initForm();
    }

    ngOnDestroy(): void {
        this.ngOnDestroy$.next();
    }

    ionViewDidEnter(): void {
        this.input.setFocus();
    }

    private initForm(): FormGroup {
        return this.fb.group({
            tasks: ['', [
                Validators.required,
                Validators.pattern(regex.safe),
            ]],
        });
    }

    public add(form: FormGroup): void {
        const tasksAsArray: string[] = form.value.tasks.split('\n');
        const taskList: ITask[] = tasksAsArray.map((str: string) => {
            const labelAndDescription: string[] = str.split('#');
            const task: ITask = {
                id: uuid.v4(),
                name: labelAndDescription[0],
                created: Date.now(),
                alertTime: null,
                parentId: this.categoryId,
                doneStatus: false,
                description: labelAndDescription[1] || null,
                qty: null,
                units: null,
            };

            return task;
        });

        // TODO: where is error handler
        this.categoryService.addMultiTasksTask(taskList).pipe(
            takeUntil(this.ngOnDestroy$)
        ).subscribe(() => {
            this.modalController.dismiss();
        });
    }

    public close(): void {
        this.modalController.dismiss();
    }
}
