// tslint:disable: no-any
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { MainPageComponent } from '@app/components/main-page/main-page.component';
import { IndexService } from '@app/services/index/index.service';
import { of } from 'rxjs';

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
                imports: [
                    RouterTestingModule,
                    HttpClientModule,
                    MatIconModule,
                    MatListModule,
                    MatButtonModule,
                    BrowserAnimationsModule,
                    HttpClientModule,
                ],
                declarations: [MainPageComponent, DialogCreateNewDrawingComponent],
                providers: [{ provide: MatDialog, useValue: {} }],
            }).compileComponents();
            TestBed.inject(MatDialog);

            fixture = TestBed.createComponent(MainPageComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }),
    );

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have onGoingDrawing as false', () => {
        expect(component.onGoingDrawing).toBeFalse();
    });

    it('should open warning message when creating a new drawing', () => {
        const matdialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        component.dialogCreator = jasmine.createSpyObj('MatDialog', ['open']);
        component.dialogCreator.open = jasmine.createSpy().and.callFake(() => {
            return matdialogRef;
        });

        component.createNewDrawing();
        expect(component.newDrawingRef).toEqual(matdialogRef);
    });

    it('should open warning message when opening "guide dutilisation"', () => {
        const matdialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        component.dialogCreator = jasmine.createSpyObj('MatDialog', ['open']);
        component.dialogCreator.open = jasmine.createSpy().and.callFake(() => {
            return matdialogRef;
        });

        component.openUserGuide();
        expect(component.checkDocumentationRef).toEqual(matdialogRef);
    });
});
