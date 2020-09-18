import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SwitchToolService } from '@app/services/switchTool-service';
import { BrushService } from '@app/services/tools/brush.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let drawingStub: DrawingService;
    let serviceTool: SwitchToolService;
    let pencilService: PencilService;
    let eraserService: EraserService;
    let brushService: BrushService;
    beforeEach(async () => {
        drawingStub = new DrawingService();
        pencilService = new PencilService(drawingStub);
        eraserService = new EraserService(drawingStub);
        brushService = new BrushService(drawingStub);
        serviceTool = new SwitchToolService(pencilService, eraserService, brushService);

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
    it('changer de service tool par brush', () => {
        component.naturalBrushTool();
        // rajouet tool = brushService
    });
});
