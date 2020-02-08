import { TranslocoService } from '@ngneat/transloco';

import { ETimeOptions } from '../../../../../shared/enums/time-options.enum';
import { IPickerOption } from '../../../../../shared/interfaces/picker-option.interface';

export function getUnitOptions(translateService: TranslocoService): IPickerOption<ETimeOptions>[] {
    return Object.keys(ETimeOptions).map((unit: string) => ({
        text: translateService.translate('picker.' + unit),
        value: ETimeOptions[unit],
    })
    );
}
