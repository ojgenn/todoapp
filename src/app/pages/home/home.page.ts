import {Component, OnInit} from '@angular/core';
import {ICategory} from '../../shared/interfaces/category.interface';
import * as uuid from 'uuid';
import {FlatMap} from '../../shared/helpers/flat-map';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePageComponent implements OnInit {
    public categoryList: FlatMap<ICategory>;
    constructor(private storage: Storage) {
    }

    ngOnInit(): void {

        // let time = Date.now();
        // ['Задачи', 'Покупки', 'Продукты', 'Аптека'].forEach(item => {
        //     time += 10;
        //     const uuid = this.getUUID();
        //     this.categoryList.push({id: uuid, name: item, readonly: true, created: time, list: []});
        // })
        //
        // this.storage.set('categoryList', this.categoryList);

        this.storage.get('categoryList').then((categoryList: ICategory[]) => {
            this.categoryList = new FlatMap(categoryList, 'created');
            this.categoryList.keys.sort();
        });
    }

    private getUUID(): string {
        return uuid.v4();
    }

}
