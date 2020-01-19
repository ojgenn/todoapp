export class FlatMap<T> {
    map: { [key: string]: T } = {};
    keys: string[] = [];

    get asArray(): Array<T> {
        return this.keys.map((key: string) => this.map[key]);
    }

    constructor(data: Array<T>, propertyAsKey: keyof T) {
        data.forEach((item: T) => {
            const key: string = item[propertyAsKey].toString();
            this.map[key] = item;
            this.keys.push(key);
        });
    }
}
