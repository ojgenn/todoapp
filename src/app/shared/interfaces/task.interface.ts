import { EUnits } from '../enums/units.enum';
import { IProduct } from './product.interface';

export interface ITask extends IProduct {
    doneStatus: boolean;
    created: number;
    alertTime: number;
    qty?: number;
    units?: EUnits;
}
