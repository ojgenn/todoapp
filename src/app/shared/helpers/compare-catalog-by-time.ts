import { ICategory } from '../interfaces/category.interface';

export function compareCatalogsByTime(first: ICategory, second: ICategory): number {
    if (first.created > second.created) {
        return 1;
    }
    if (first.created === second.created) {
        return 0;
    }
    return -1;
}
