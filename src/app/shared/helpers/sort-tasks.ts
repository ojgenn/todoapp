import { ITask } from '../interfaces/task.interface';

function sortTaskByParameter(tasklist: ITask[], key: string): ITask[] {
    return tasklist.sort((first: ITask, second: ITask) => {
        return first[key] < second[key] ? -1 : first[key] > second[key] ? 1 : 0;
    });
}

export function sortTaskList(list: ITask[]): ITask[] {
    const separatedTasks: Record<string, ITask[]> = {
        alertTime: [],
        done: [],
        other: []
    };
    list.forEach((task: ITask) => {
        if (!!task.doneStatus) {
            separatedTasks.done.push(task);
        } else if (task.alertTime) {
            separatedTasks.alertTime.push(task);
        } else {
            separatedTasks.other.push(task);
        }
    });

    const alertTime: ITask[] = sortTaskByParameter(separatedTasks.alertTime, 'alertTime').reverse();
    const done: ITask[] = sortTaskByParameter(separatedTasks.done, 'created').reverse();
    const other: ITask[] = sortTaskByParameter(separatedTasks.other, 'created').reverse();

    return [...alertTime, ...other, ...done];
}
