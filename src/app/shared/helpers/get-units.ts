import { EUnits } from '../enums/units.enum';
import { ISelect } from '../interfaces/select.interface';
import { FlatMap } from './flat-map';

export const UNITS: FlatMap<ISelect<EUnits>> = new FlatMap([
    { value: EUnits.NONE, label: 'units.NONE' },
    { value: EUnits.PIECE, label: 'units.PIECE' },
    { value: EUnits.KG, label: 'units.KG' },
    { value: EUnits.LITER, label: 'units.LITER' },
    { value: EUnits.GRAM, label: 'units.GRAM' },
    { value: EUnits.MILLILITER, label: 'units.MILLILITER' },
], 'value');
