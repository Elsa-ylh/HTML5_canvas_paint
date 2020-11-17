import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { PolygoneAction } from '@app/classes/undo-redo/polygon-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PolygonService } from '@app/services/tools/polygon.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-magic-numbers
describe('PolygonAction', () => {
    let polygonActionStub: PolygoneAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let polygonStub: PolygonService;

    let mousePosition: Vec2;
    let mouseDownCord: Vec2;
    let primaryColor: string;
    let secondaryColor: string;
    let lineWidth: number;
    let nbsides: number;
    let isRenderingBase: boolean;
    let selectSubTool: SubToolselected;
    let autoSaveStub: AutomaticSaveService;
    let canvasResizerStub: CanvasResizerService;
    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        mousePosition = { x: 5, y: 6 };
        mouseDownCord = { x: 6, y: 9 };
        primaryColor = '#000000';
        secondaryColor = '#ffffff';
        // tslint:disable:no-magic-numbers
        lineWidth = 2;
        // tslint:disable:no-magic-numbers
        nbsides = 3;
        selectSubTool = SubToolselected.tool1;
        isRenderingBase = true;

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        canvasResizerStub = new CanvasResizerService(undoRedoStub);
        autoSaveStub = new AutomaticSaveService(canvasResizerStub, drawingStub);
        polygonStub = new PolygonService(drawingStub, colorStub, undoRedoStub, autoSaveStub);

        polygonActionStub = new PolygoneAction(
            mousePosition,
            mouseDownCord,
            primaryColor,
            secondaryColor,
            lineWidth,
            nbsides,
            isRenderingBase,
            selectSubTool,
            polygonStub,
            drawingStub,
        );

        canvas = canvasTestHelper.canvas;
        // tslint:disable:no-magic-numbers
        canvas.width = 100;
        canvas.height = 100;
        baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingStub.canvas = canvas;
        drawingStub.baseCtx = baseStub;
        drawingStub.previewCtx = previewStub;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ColorService, useValue: colorStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: PolygoneAction, useValue: polygonActionStub },
                { provide: PolygonService, useValue: polygonStub },
            ],
        });
        polygonActionStub = TestBed.inject(PolygoneAction);
        polygonStub = TestBed.inject(PolygonService);
    });

    it('strokeColor and linewidth must be primary color and thickness of polygonAction', () => {
        drawingStub.baseCtx.shadowColor = drawingStub.previewCtx.shadowColor = '#000000' as string;
        polygonActionStub.apply();
        expect(drawingStub.baseCtx.strokeStyle).toEqual(primaryColor);
        expect(drawingStub.baseCtx.lineWidth).toEqual(lineWidth);
    });

    it('should call selectPolygon', () => {
        const drawLineSpy = spyOn(polygonStub, 'selectPolygon').and.stub();
        polygonActionStub.apply();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should call clearEffectTool', () => {
        const clearEffectSpy = spyOn(polygonStub, 'clearEffectTool').and.stub();
        polygonActionStub.apply();
        expect(clearEffectSpy).toHaveBeenCalled();
    });
});
