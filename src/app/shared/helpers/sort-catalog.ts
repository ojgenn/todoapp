import { ICategory } from '../interfaces/category.interface';

export function sortCatalog(catalog: ICategory[]): ICategory[] {
    const modifiedCatalog: Record<string, ICategory[]> = { readonly: [], done: [], other: [] };
    catalog.forEach((category: ICategory) => {
        if (category.readonly) {
            modifiedCatalog.readonly.push(category);
        } else {
            if (category.doneStatus) {
                modifiedCatalog.done.push(category);
            } else {
                modifiedCatalog.other.push(category);
            }
        }
    });

    return [...modifiedCatalog.readonly, ...modifiedCatalog.other, ...modifiedCatalog.done];
}
