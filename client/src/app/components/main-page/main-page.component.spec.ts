import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { IndexService } from '@app/services/index/index.service';
import { of } from 'rxjs';
import { MainPageComponent } from './main-page.component';

import SpyObj = jasmine.SpyObj;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let indexServiceSpy: SpyObj<IndexService>;

    beforeEach(
        waitForAsync(() => {
            indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet', 'basicPost']);
            indexServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));
            indexServiceSpy.basicPost.and.returnValue(of());

            TestBed.configureTestingModule({
                imports: [RouterTestingModule, HttpClientModule],
                declarations: [MainPageComponent],
                providers: [{ provide: MatDialog, useValue: {} }],
            }).compileComponents();
        }),
    );

    beforeEach(async () => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have onGoingDrawing as false', () => {
        expect(component.onGoingDrawing).toBeFalse();
    });

    it('should open a new drawing modal', () => {
        fixture.whenStable().then(() => {
            component.createNewDrawing();
            expect(component.createNewDrawing).toHaveBeenCalled();
        });
    });

    it('should open a new drawin modal user guide', () => {
        fixture.whenStable().then(() => {
            component.openUserGuide();
            expect(component.openUserGuide).toHaveBeenCalled();
        });
    });
});
