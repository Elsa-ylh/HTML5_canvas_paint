// tslint:disable: no-any
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { MainPageComponent } from '@app/components/main-page/main-page.component';
import { Subject } from 'rxjs';

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let dialogMock: jasmine.SpyObj<MatDialog>;

    beforeEach(
        waitForAsync(() => {
            dialogMock = jasmine.createSpyObj('dialogCreator', ['open']);

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
                providers: [
                    { provide: MatDialog, useValue: dialogMock },
                    { provide: MatDialogRef, useValue: {} },
                ],
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

    it('should set isDialogOpenSaveEport to true after closed', () => {
        component.isDialogOpenSaveEport = false;
        const closedSubject = new Subject<any>();

        const dialogRefMock = jasmine.createSpyObj('dialogRef', ['afterClosed']) as jasmine.SpyObj<MatDialogRef<any>>;
        dialogRefMock.afterClosed.and.returnValue(closedSubject.asObservable());
        dialogMock.open.and.returnValue(dialogRefMock);

        component.openCarrousel();
        expect(component.isDialogOpenSaveEport).toEqual(true);

        closedSubject.next();

        expect(component.isDialogOpenSaveEport).toEqual(false);
    });

    it('should set isDialogOpenSaveEport to true after closed', () => {
        component.isDialogOpenSaveEport = true;
        component.openCarrousel();
        expect(component.isDialogOpenSaveEport).toEqual(true);
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
