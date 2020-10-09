import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { ColorComponent } from '../color/color.component';
import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [EditorComponent, DrawingComponent, SidebarComponent, ColorComponent],
                imports: [],
                providers: [
                    { provide: MAT_DIALOG_DATA, useValue: {} },
                    { provide: MatDialog, useValue: {} },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
