// tslint:disable: no-any
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
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { cursorName } from '@app/classes/cursor-name';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { ToolUsed } from '@app/classes/tool';
import { ColorComponent } from '@app/components/color/color.component';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { DropperColorComponent } from '@app/components/dropper-color/dropper-color.component';
import { WriteTextDialogUserGuideComponent } from '@app/components/write-text-dialog-user-guide/write-text-dialog-user-guide.component';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';
import { BrushService } from '@app/services/tools/brush.service';
import { DropperService } from '@app/services/tools/dropper.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { PolygonService } from '@app/services/tools/polygon.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { SelectionService } from '@app/services/tools/selection-service';
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
    let dropperServiceStub: DropperService;
    let selectionStub: SelectionService;
    let polygonStub: PolygonService;

    let canvas: HTMLCanvasElement;
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;

    beforeEach(async () => {
        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        rectangleStub = new RectangleService(drawingStub, colorStub);
        ellipseStub = new EllipseService(drawingStub, colorStub);
        brushStub = new BrushService(drawingStub, colorStub);
        pencilStub = new PencilService(drawingStub, colorStub);
        eraserStub = new EraserService(drawingStub);
        lineStub = new LineService(drawingStub, colorStub);
        dropperServiceStub = new DropperService(drawingStub, colorStub);

        toolServiceStub = new ToolService(
            pencilStub,
            eraserStub,
            brushStub,
            lineStub,
            rectangleStub,
            ellipseStub,
            dropperServiceStub,
            selectionStub,
            polygonStub,
        );
        selectionStub = new SelectionService(drawingStub);
        polygonStub = new PolygonService(drawingStub, colorStub);

        canvas = canvasTestHelper.canvas;
        // tslint:disable: no-magic-numbers
        canvas.width = 100;
        canvas.height = 100;
        baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        drawingStub.canvas = canvas;
        drawingStub.baseCtx = baseStub; // Jasmine doesnt copy properties with underlying data
        drawingStub.previewCtx = previewStub;

        await TestBed.configureTestingModule({
            declarations: [
                SidebarComponent,
                ColorComponent,
                WriteTextDialogUserGuideComponent,
                DialogCreateNewDrawingComponent,
                DropperColorComponent,
            ],
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
                { provide: SelectionService, useValue: selectionStub },
                { provide: ToolService, useValue: toolServiceStub },
                { provide: DropperService, useValue: dropperServiceStub },
                { provide: MatDialog, useValue: {} },
                { provide: PolygonService, useValue: polygonStub },
            ],
        }).compileComponents();
        TestBed.inject(MatDialog);
        TestBed.inject(DomSanitizer);

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
    it('pickPencil', () => {
        component.pickPencil();
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Pencil);
    });
    it('pickEraser()', () => {
        component.pickEraser();
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Eraser);
    });
    it('pickRectangle()', () => {
        component.pickRectangle(SubToolselected.tool1);
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Rectangle);
    });
    it('pickEllipse()', () => {
        component.pickEllipse(SubToolselected.tool1);
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Ellipse);
    });
    it('pickDropper()', () => {
        component.pickDropper();
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Dropper);
    });

    it(' should clear canvas dialog', () => {
        component.clearCanvas();
        expect(component.isDialogOpen).toEqual(false);
    });

    it(' should create new drawing dialog', () => {
        const createNewDrawingSpy = spyOn<any>(component, 'createNewDrawing');
        component.createNewDrawing();
        expect(createNewDrawingSpy).toHaveBeenCalled();
    });

    it(' should open user guide dialog', () => {
        const openUserGuideSpy = spyOn<any>(component, 'openUserGuide');
        component.openUserGuide();
        expect(openUserGuideSpy).toHaveBeenCalled();
    });

    it(' should pick pencil', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool');
        component.pickPencil();
        expect(drawingStub.cursorUsed).toEqual(cursorName.pencil);
        expect(switchToolSpy).toHaveBeenCalled();
    });
});
