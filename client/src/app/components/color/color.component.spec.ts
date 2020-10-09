import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
// import { ColorService } from '@app/services/color/color.service';
// import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorComponent } from './color.component';

describe('ColorComponent', () => {
    let component: ColorComponent;
    let fixture: ComponentFixture<ColorComponent>;
    // let colorStub: ColorService;
    // let drawingStub: DrawingService;

    beforeEach(async () => {
        // sanitizer = new DomSanitizer();
        // colorStub = new ColorService(drawingStub);
        // matDialog= new MatDialog;
        await TestBed.configureTestingModule({
            declarations: [ColorComponent],
            providers: [
                { provide: MatDialog, useValue: {} },
                {
                    provide: MatIconRegistry,
                    useValue: {
                        addSvgIcon: () => '',
                    },
                },
                {
                    provide: DomSanitizer,
                    useValue: {
                        bypassSecurityTrustResourceUrl: () => '',
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorComponent);
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
