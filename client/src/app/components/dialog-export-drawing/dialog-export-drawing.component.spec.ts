/* tslint:disable:no-unused-variable */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogExportDrawingComponent } from './dialog-export-drawing.component';

describe('DialogExportDrawingComponent', () => {
    let component: DialogExportDrawingComponent;
    let fixture: ComponentFixture<DialogExportDrawingComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [MatDialogModule, MatIconModule, BrowserAnimationsModule, HttpClientModule],
                declarations: [DialogExportDrawingComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(DialogExportDrawingComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }),
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
