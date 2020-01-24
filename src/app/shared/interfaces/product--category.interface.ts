import { IProduct } from './product.interface';

export interface IProductCategory {
    id: string;
    name: string;
    list: IProduct[];
}
