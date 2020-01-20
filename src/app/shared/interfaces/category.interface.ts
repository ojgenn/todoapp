import { CategoryStatus } from '../enums/category-status.enum';

export interface ICategory {
    id: string;
    name: string;
    readonly: boolean;
    created: number;
    list: any[];
    status?: CategoryStatus;
}
