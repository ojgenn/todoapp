import { IProduct } from '../interfaces/product.interface';

export function compareProducts(first: IProduct, second: IProduct): number {
    return first.name.toUpperCase() > second.name.toUpperCase() ? 1 : first.name.toUpperCase() === second.name.toUpperCase() ? 0 : -1;
}
