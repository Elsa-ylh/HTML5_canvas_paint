import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let drawingStub: DrawingService;

    beforeEach(async () => {
        drawingStub = new DrawingService();

        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: DrawingService, useValue: drawingStub },
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
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('click natural rush tool ', () => {
        fixture.whenStable().then(() => {
            component.naturalBrushTool();
            expect(component.naturalBrushTool).toHaveBeenCalled();
        });
    });
});
