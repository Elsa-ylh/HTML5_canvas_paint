import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { Tool, ToolUsed } from '@app/classes/tool';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';
import { BrushService } from '@app/services/tools/brush.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { SidebarComponent } from './sidebar.component';

class ToolStub extends Tool {}

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let drawingStub: DrawingService;
    let toolServiceStub: ToolService;
    let toolStub: ToolStub;
    let rectangleStub: RectangleService;
    let ellipseStub: EllipseService;
    let brushStub: BrushService;
    let pencilStub: PencilService;
    let eraserStub: EraserService;
    let lineStub: LineService;
    let ColorStub: ColorService;
    beforeEach(async () => {
        drawingStub = new DrawingService();
        ColorStub = new ColorService(drawingStub);
        rectangleStub = new RectangleService(drawingStub, ColorStub);
        ellipseStub = new EllipseService(drawingStub, ColorStub);
        brushStub = new BrushService(drawingStub, ColorStub);
        pencilStub = new PencilService(drawingStub, ColorStub);
        eraserStub = new EraserService(drawingStub);
        lineStub = new LineService(drawingStub, ColorStub);
        toolServiceStub = new ToolService(pencilStub, eraserStub, brushStub, lineStub, rectangleStub, ellipseStub);

        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ToolService, useValue: toolStub },
                { provide: RectangleService, useValue: rectangleStub },
                { provide: EllipseService, useValue: ellipseStub },
                { provide: BrushService, useValue: brushStub },
                { provide: PencilService, useValue: pencilStub },
                { provide: EraserService, useValue: eraserStub },
                { provide: LineService, useValue: lineStub },
                { provide: ToolService, useValue: toolServiceStub },
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
    // it('createNew drawing ', () => {
    //    component.createNewDrawing();
    //    expect(component).toHaveBeenCalled();
    // });
    // it('clearCanvas', () => {
    //    component.clearCanvas();
    //    expect(component.isDialogOpen).toEqual(false);
    // });
    it('pickPencil', () => {
        component.pickPencil();
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Pencil);
    });
    it('pickEraser()', () => {
        component.pickEraser();
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Eraser);
    });
    // it('pickBrush()', () => {
    //    component.pickBrush(SubToolselected.tool1);
    //    expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Brush);
    // });
    // it('pickLine()', () => {
    //    component.pickLine();
    //    expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Line);
    // });
    it('pickRectangle()', () => {
        component.pickRectangle(SubToolselected.tool1);
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Rectangle);
    });
    it('pickEllipse()', () => {
        component.pickEllipse(SubToolselected.tool1);
        expect(toolServiceStub.currentToolName).toEqual(ToolUsed.Ellipse);
    });
    /*it('pickColor()', () => {
        component.pickColor();
        expect(toolServiceStub.currentToolName).not.toEqual(ToolUsed.Pencil);
    });*/
    it('resetCheckedButton()', () => {
        component.resetCheckedButton();
        const isPencilChecked: boolean = component.pencilChecked;
        expect(isPencilChecked).toBeFalse;
    });
});
