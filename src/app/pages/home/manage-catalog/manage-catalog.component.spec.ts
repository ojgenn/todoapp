import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IonicModule } from '@ionic/angular';

import { ManageCatalogComponent } from './manage-catalog.component';

describe('ManageCatalogComponent', () => {
    let component: ManageCatalogComponent;
    let fixture: ComponentFixture<ManageCatalogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ManageCatalogComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(ManageCatalogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
