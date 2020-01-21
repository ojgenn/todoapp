import { ITask } from './task.interface';

export interface ICategory {
    id: string;
    name: string;
    readonly: boolean;
    created: number;
    list: ITask[];
    doneStatus?: boolean;
}
