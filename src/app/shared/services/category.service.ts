import { Injectable } from '@angular/core';

import { of, BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { sortTaskList } from '../helpers/sort-tasks';
import { ICategory } from '../interfaces/category.interface';
import { ITask } from '../interfaces/task.interface';
import { StoreService } from './store.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private category$: BehaviorSubject<ICategory> = new BehaviorSubject(null);

    constructor(private storeService: StoreService) {
    }

    public initCategory(id: string): void {
        this.category$.next(this.storeService.getCategory(id));
    }

    public getCategory(): Observable<ICategory> {
        return this.category$.asObservable();
    }

    public addTask(task: ITask): Observable<unknown> {
        const category: ICategory = this.category$.value;
        const list: ITask[] = [...category.list];
        list.push(task);
        category.list = sortTaskList(list);
        return this.storeService.renewCategory(category).pipe(
            tap(() => this.category$.next(category)),
        );
    }

    public deleteTask(index: number): Observable<unknown> {
        const category: ICategory = this.category$.value;
        const list: ITask[] = [...category.list];
        list.splice(index, 1);
        category.list = list;
        return this.storeService.renewCategory(category).pipe(
            tap(() => this.category$.next(category)),
        );
    }

    public toggleDone(index: number): Observable<unknown> {
        const category: ICategory = this.category$.value;
        const list: ITask[] = [...category.list];
        list[index].doneStatus = !list[index].doneStatus;
        category.list = sortTaskList(list);
        return this.storeService.renewCategory(category).pipe(
            tap(() => this.category$.next(category)),
        );
    }

    public editTask(task: ITask, index: number): Observable<unknown> {
        const category: ICategory = this.category$.value;
        const list: ITask[] = [...category.list];
        list[index] = task;
        category.list = sortTaskList(list);
        return this.storeService.renewCategory(category).pipe(
            tap(() => this.category$.next(category)),
        );
    }
}
