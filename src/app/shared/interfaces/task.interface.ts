import { IProduct } from './product.interfact';

export interface ITask extends IProduct {
    doneStatus: boolean;
    created: number;
    alertTime: number;
}
