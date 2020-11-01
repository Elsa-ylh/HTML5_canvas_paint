import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { SelectionEllipseService } from '@app/services/tools/selection-service/selection-ellipse.service';
import { SelectionRectangleService } from '@app/services/tools/selection-service/selection-rectangle.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Observable, Subject } from 'rxjs';
import { SidebarComponent } from './sidebar.component';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:max-file-line-count

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
    let polygonStub: PolygonService;
    let selectionRectangleStub: SelectionRectangleService;
    let selectionEllipseStub: SelectionEllipseService;
    let undoRedoStub: UndoRedoService;

    let canvas: HTMLCanvasElement;
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let dialogMock: jasmine.SpyObj<MatDialog>;
    beforeEach(
        waitForAsync(() => {
            drawingStub = new DrawingService();
            colorStub = new ColorService(drawingStub);
            undoRedoStub = new UndoRedoService(drawingStub);
            rectangleStub = new RectangleService(drawingStub, colorStub, undoRedoStub);
            ellipseStub = new EllipseService(drawingStub, colorStub, undoRedoStub);
            brushStub = new BrushService(drawingStub, colorStub, undoRedoStub);
            pencilStub = new PencilService(drawingStub, colorStub, undoRedoStub);
            eraserStub = new EraserService(drawingStub, undoRedoStub);
            lineStub = new LineService(drawingStub, colorStub, undoRedoStub);
            dropperServiceStub = new DropperService(drawingStub, colorStub);
            toolServiceStub = new ToolService(
                pencilStub,
                eraserStub,
                brushStub,
                lineStub,
                rectangleStub,
                ellipseStub,
                dropperServiceStub,
                polygonStub,
                selectionRectangleStub,
                selectionEllipseStub,
            );

            selectionRectangleStub = new SelectionRectangleService(drawingStub, undoRedoStub);
            selectionEllipseStub = new SelectionEllipseService(drawingStub, undoRedoStub);
            polygonStub = new PolygonService(drawingStub, colorStub, undoRedoStub);
            canvas = canvasTestHelper.canvas;
            canvas.width = 100;
            canvas.height = 100;
            baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
            previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
            // Configuration du spy du service
            // tslint:disable:no-string-literal
            drawingStub.canvas = canvas;
            drawingStub.baseCtx = baseStub; // Jasmine doesnt copy properties with underlying data
            drawingStub.previewCtx = previewStub;

            dialogMock = jasmine.createSpyObj('dialogCreator', ['open']);

            TestBed.configureTestingModule({
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
                    { provide: SelectionRectangleService, usevalue: selectionRectangleStub },
                    { provide: SelectionEllipseService, useValue: selectionEllipseStub },
                    { provide: ToolService, useValue: toolServiceStub },
                    { provide: DropperService, useValue: dropperServiceStub },
                    { provide: MatDialog, useValue: dialogMock },
                    { provide: MatDialogRef, useValue: {} },
                    { provide: PolygonService, useValue: polygonStub },
                    { provide: Observable, useValue: {} },
                ],
            }).compileComponents();
            TestBed.inject(MatDialog);
            TestBed.inject(MatDialogRef);
            TestBed.inject(DomSanitizer);
            fixture = TestBed.createComponent(SidebarComponent);
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
        drawingStub.baseCtx.fillStyle = 'green';
        drawingStub.baseCtx.fillRect(10, 10, drawingStub.canvas.width, drawingStub.canvas.height);

        const closedSubject = new Subject<any>();

        const dialogRefMock = jasmine.createSpyObj('dialogRef', ['afterClosed']) as jasmine.SpyObj<MatDialogRef<any>>;
        dialogRefMock.afterClosed.and.returnValue(closedSubject.asObservable());
        dialogMock.open.and.returnValue(dialogRefMock);

        component.clearCanvas();
        expect(component.isDialogOpen).toEqual(true);

        closedSubject.next();

        expect(component.isDialogOpen).toEqual(false);
    });

    it(' should create new drawing dialog', () => {
        component.dialogCreator = jasmine.createSpyObj('MatDialog', ['open']);
        component.dialogCreator.open = jasmine.createSpy().and.callFake(() => {
            return component;
        });
        component.createNewDrawing();
        expect(component.dialogCreator.open).toHaveBeenCalled();
    });
    it(' should open user guide dialog', () => {
        const matdialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        component.dialogCreator = jasmine.createSpyObj('MatDialog', ['open']);
        component.dialogCreator.open = jasmine.createSpy().and.callFake(() => {
            return matdialogRef;
        });
        component.openCarrouse();
        expect(component.newCarrouselRef).toEqual(matdialogRef);
    });
    it('should open writeTextDialogUserComponent', () => {
        const matdialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        component.dialogCreator = jasmine.createSpyObj('MatDialog', ['open']);
        component.dialogCreator.open = jasmine.createSpy().and.callFake(() => {
            return matdialogRef;
        });
        component.openUserGuide();
        expect(component.checkDocumentationRef).toEqual(matdialogRef);
    });
    it(' should pick pencil', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        component.pickPencil();
        expect(drawingStub.cursorUsed).toEqual(cursorName.pencil);
        expect(switchToolSpy).toHaveBeenCalled();
    });
    it(' should pick eraser', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        component.pickEraser();
        expect(drawingStub.cursorUsed).toEqual(cursorName.eraser);
        expect(switchToolSpy).toHaveBeenCalled();
    });
    it(' should pick brush and set baseCtx and previewCtx lineWidth', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        drawingStub.baseCtx.lineWidth = 10;
        brushStub.pixelMinBrush = 20;
        component.pickBrush(2);
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(2);
        expect(drawingStub.baseCtx.lineWidth).toEqual(brushStub.pixelMinBrush);
        expect(drawingStub.previewCtx.lineWidth).toEqual(brushStub.pixelMinBrush);
    });
    it(' should pick brush and set previewCtx lineWidth', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        drawingStub.baseCtx.lineWidth = 20;
        brushStub.pixelMinBrush = 10;
        component.pickBrush(2);
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(2);
        expect(drawingStub.previewCtx.lineWidth).toEqual(drawingStub.baseCtx.lineWidth);
    });
    it('should pick line', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        component.pickLine();
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(SubToolselected.tool1);
    });
    it('should pick rectangle', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        component.pickRectangle(SubToolselected.tool2);
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(SubToolselected.tool2);
    });
    it('should pick ellipse', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        component.pickEllipse(1);
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(SubToolselected.tool1);
    });
    it('should pick polygon', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        component.pickPolygon(1);
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(SubToolselected.tool1);
    });
    it('should pick color', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        component.pickColor();
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
    });
    it('should pick dropper', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        component.pickDropper();
        expect(drawingStub.cursorUsed).toEqual('pointer');
        expect(switchToolSpy).toHaveBeenCalled();
    });
    it('should pick selection rectangle', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        component.pickSelectionRectangle();
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        // expect(toolServiceStub.currentToolName).toEqual(ToolUsed.SelectionRectangle);
    });
    it('should pick selection ellipse', () => {
        const switchToolSpy = spyOn<any>(toolServiceStub, 'switchTool').and.stub();
        component.pickSelectionEllipse();
        expect(drawingStub.cursorUsed).toEqual(cursorName.default);
        expect(switchToolSpy).toHaveBeenCalled();
        // expect(toolServiceStub.currentToolName).toEqual(ToolUsed.SelectionRectangle);
    });
    it('should set all checked to false', () => {
        component.resetCheckedButton();
        expect(component.pencilChecked).toEqual(false);
        expect(component.eraserChecked).toEqual(false);
        expect(component.brushChecked).toEqual(false);
        expect(component.lineChecked).toEqual(false);
        expect(component.rectangleChecked).toEqual(false);
        expect(component.ellipseChecked).toEqual(false);
        expect(component.polygonChecked).toEqual(false);
        expect(component.colorChecked).toEqual(false);
        expect(component.dropperChecked).toEqual(false);
        expect(component.selectionRectangleChecked).toEqual(false);
        expect(component.selectionEllipseChecked).toEqual(false);
        expect(component.selectionEllipseChecked).toEqual(false);
        expect(component.selectionRectangleChecked).toEqual(false);
    });
    it('should set subtoolselected as tool 2', () => {
        const event = { checked: true } as MatCheckboxChange;
        component.CheckboxChangeToggle(event);
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(SubToolselected.tool2);
    });
    it('should set subtoolselected as tool 1', () => {
        const event = { checked: false } as MatCheckboxChange;
        component.CheckboxChangeToggle(event);
        expect(toolServiceStub.currentTool.subToolSelect).toEqual(SubToolselected.tool1);
    });
    it('should call preventDefault clearCanvas and set isDialogOpen to true', () => {
        component.isDialogOpen = false;
        drawingStub.baseCtx.beginPath();
        drawingStub.baseCtx.moveTo(50, 50);
        drawingStub.baseCtx.lineTo(100, 100);
        drawingStub.baseCtx.stroke();
        const event = new KeyboardEvent('window:keydown.control.o', {});
        const preventDefaultSpy = spyOn(event, 'preventDefault').and.callThrough();
        const clearCanvasSpy = spyOn(component, 'clearCanvas').and.stub();
        window.dispatchEvent(event);
        component.onKeyDown(event);
        expect(preventDefaultSpy);
        expect(clearCanvasSpy).toHaveBeenCalled();
    });

    it('should call resetCheckedButton set isRectangleChecked to true should call pickRectangle', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.1', {});
        const spyReset = spyOn(component, 'resetCheckedButton').and.callThrough();
        const spyPickRect = spyOn(component, 'pickRectangle').and.callThrough();
        window.dispatchEvent(event);
        component.changeRectangleMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(component.rectangleChecked).toEqual(true);
        expect(spyPickRect).toHaveBeenCalled();
    });
    it('should call resetCheckedButton set isEllipseChecked to true should call pickEllipse', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.2', {});
        const spyReset = spyOn(component, 'resetCheckedButton').and.callThrough();
        const spyPickEllipse = spyOn(component, 'pickEllipse').and.callThrough();
        window.dispatchEvent(event);
        component.changleEllipseMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(component.ellipseChecked).toEqual(true);
        expect(spyPickEllipse).toHaveBeenCalled();
    });
    it('should call resetCheckedButton set isPolygonChecked to true should call pickPolygon', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.3', {});
        const spyReset = spyOn(component, 'resetCheckedButton').and.callThrough();
        const spyPickPoly = spyOn(component, 'pickPolygon').and.callThrough();
        window.dispatchEvent(event);
        component.changePolygonMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(component.polygonChecked).toEqual(true);
        expect(spyPickPoly).toHaveBeenCalled();
    });

    it(' should call resetCheckButton set isEraserChecked to true should call pickEraser', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.e', {});
        const spyReset = spyOn(component, 'resetCheckedButton').and.callThrough();
        const spyPickEraser = spyOn(component, 'pickEraser').and.callThrough();
        window.dispatchEvent(event);
        component.changeEraserMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(component.eraserChecked).toEqual(true);
        expect(spyPickEraser).toHaveBeenCalled();
    });

    it(' should call resetCheckButton set isPencilChecked to true should call pickPencil', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.e', {});
        const spyReset = spyOn(component, 'resetCheckedButton').and.callThrough();
        const spyPickPencil = spyOn(component, 'pickPencil').and.callThrough();
        window.dispatchEvent(event);
        component.changePencilMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(component.pencilChecked).toEqual(true);
        expect(spyPickPencil).toHaveBeenCalled();
    });

    it(' should call resetCheckButton set isBrushChecked to true should call pickBrush', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.w', {});
        const spyReset = spyOn(component, 'resetCheckedButton').and.callThrough();
        const spyPickBrush = spyOn(component, 'pickBrush').and.callThrough();
        window.dispatchEvent(event);
        component.changeBrushMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(component.brushChecked).toEqual(true);
        expect(spyPickBrush).toHaveBeenCalled();
    });

    it(' should call resetCheckButton set isLineChecked to true should call pickLine', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.l', {});
        const spyReset = spyOn(component, 'resetCheckedButton').and.callThrough();
        const spyPickLine = spyOn(component, 'pickLine').and.callThrough();
        window.dispatchEvent(event);
        component.changeLineMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(component.lineChecked).toEqual(true);
        expect(spyPickLine).toHaveBeenCalled();
    });

    it(' should call resetCheckButton set isDropperChecked to true should call pickDropper', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.i', {});
        const spyReset = spyOn(component, 'resetCheckedButton').and.callThrough();
        const spyPickDropper = spyOn(component, 'pickDropper').and.callThrough();
        window.dispatchEvent(event);
        component.changeDropperMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(component.dropperChecked).toEqual(true);
        expect(spyPickDropper).toHaveBeenCalled();
    });

    it(' should call resetCheckButton set isSelectionChecked and isSelectionRectangleChecked to true should call pickSelectionRect', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.r', {});
        const spyReset = spyOn(component, 'resetCheckedButton').and.callThrough();
        const spyPickSelectionRect = spyOn(component, 'pickSelectionRectangle').and.callThrough();
        window.dispatchEvent(event);
        component.changeSelectionRectangleMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(component.selectionRectangleChecked).toEqual(true);
        expect(spyPickSelectionRect).toHaveBeenCalled();
    });

    it(' should call resetCheckButton set isSelectionChecked and isSelectionEllipseChecked to true should call pickSelectionEllipse', () => {
        toolServiceStub.currentToolName = ToolUsed.Pencil;
        const event = new KeyboardEvent('window:keydown.s', {});
        const spyReset = spyOn(component, 'resetCheckedButton').and.callThrough();
        const spyPickSelectionEllipse = spyOn(component, 'pickSelectionEllipse').and.stub();
        window.dispatchEvent(event);
        component.changeSelectionEllipseMode(event);
        expect(spyReset).toHaveBeenCalled();
        expect(component.selectionEllipseChecked).toEqual(true);
        expect(spyPickSelectionEllipse).toHaveBeenCalled();
    });
    
    // it('should call prevent default and selectAll for rectangle', () => {
    //     toolServiceStub.currentToolName = ToolUsed.SelectionRectangle;
    //     const event = new KeyboardEvent('window:keydown.control.a', {});
    //     const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
    //     const spySelectAllRect = spyOn(selectionRectangleStub, 'selectAll').and.stub();
    //     window.dispatchEvent(event);
    //     component.selectAllCanvas(event);
    //     expect(spyPreventDefault).toHaveBeenCalled();
    //     expect(spySelectAllRect).toHaveBeenCalled();
    // });

    it('should call prevent default and selectAll for ellipse', () => {
        toolServiceStub.currentToolName = ToolUsed.SelectionEllipse;
        const event = new KeyboardEvent('window:keydown.control.a', {});
        const spyPreventDefault = spyOn(event, 'preventDefault').and.callThrough();
        const spySelectAllEllipse = spyOn(selectionEllipseStub, 'selectAll').and.stub();
        window.dispatchEvent(event);
        component.selectAllCanvas(event);
        expect(spyPreventDefault).toHaveBeenCalled();
        expect(spySelectAllEllipse).toHaveBeenCalled();
    });
});
