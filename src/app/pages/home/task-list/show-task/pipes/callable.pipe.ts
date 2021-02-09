import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'callable'
})
export class CallablePipe implements PipeTransform {

    transform(value: string): string {
        const reg: RegExp = /(\+7|8)[- _]*\(?[- _]*(\d{3}[- _]*\)?([- _]*\d){7}|\d\d[- _]*\d\d[- _]*\)?([- _]*\d){6})/g;

        const matches: string[] = value.match(reg);
        Array.from(matches).forEach((match: string) => {
            value = value.replace(match, `<a href="tel:${match}">${match}</a>`);
        });

        return value;
    }

}
