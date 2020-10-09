import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';
import { BrushService } from '@app/services/tools/brush.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { ColorComponent } from '../color/color.component';
import { DialogCreateNewDrawingComponent } from '../dialog-create-new-drawing/dialog-create-new-drawing.component';
import { WriteTextDialogUserGuideComponent } from '../write-text-dialog-user-guide/write-text-dialog-user-guide.component';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let drawingStub: DrawingService;
    let toolServiceStub: ToolService;
    let rectangleStub: RectangleService;
    let ellipseStub: EllipseService;
    let brushStub: BrushService;
    let pencilStub: PencilService;
    let eraserStub: EraserService;
    let lineStub: LineService;
    let colorStub: ColorService;
    beforeEach(async () => {
        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        rectangleStub = new RectangleService(drawingStub, colorStub);
        ellipseStub = new EllipseService(drawingStub, colorStub);
        brushStub = new BrushService(drawingStub, colorStub);
        pencilStub = new PencilService(drawingStub, colorStub);
        eraserStub = new EraserService(drawingStub);
        lineStub = new LineService(drawingStub, colorStub);
        toolServiceStub = new ToolService(pencilStub, eraserStub, brushStub, lineStub, rectangleStub, ellipseStub);

        await TestBed.configureTestingModule({
            declarations: [SidebarComponent, ColorComponent, WriteTextDialogUserGuideComponent, DialogCreateNewDrawingComponent],
            imports: [
                MatIconModule,
                MatGridListModule,
                MatSlideToggleModule,
                MatButtonToggleModule,
                MatButtonModule,
                MatListModule,
                MatInputModule,
                MatCheckboxModule,
                BrowserAnimationsModule,
                HttpClientModule,
            ],
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ToolService, useValue: toolServiceStub },
                { provide: RectangleService, useValue: rectangleStub },
                { provide: EllipseService, useValue: ellipseStub },
                { provide: BrushService, useValue: brushStub },
                { provide: PencilService, useValue: pencilStub },
                { provide: EraserService, useValue: eraserStub },
                { provide: LineService, useValue: lineStub },
                { provide: ToolService, useValue: toolServiceStub },
                { provide: MatDialog, useValue: {} },
            ],
        }).compileComponents();

        TestBed.inject(DomSanitizer);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
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
