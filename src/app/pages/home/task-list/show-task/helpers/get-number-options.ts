import { IPickerOption } from '../../../../../shared/interfaces/picker-option.interface';

export function getNumberOptions(): IPickerOption<number>[] {
    return Array.from(Array(100)
        .keys())
        .map((item: number) => ({
            text: (item + 1).toString(),
            value: item + 1,
        }));
}
