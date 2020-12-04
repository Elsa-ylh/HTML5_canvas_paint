import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SprayAction } from '@app/classes/undo-redo/spray-action';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SprayService } from '@app/services/tools/spray.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-magic-numbers
describe('SprayAction', () => {
    let sprayActionStub: SprayAction;
    let drawingStub: DrawingService;
    let colorStub: ColorService;
    let undoRedoStub: UndoRedoService;
    let sprayStub: SprayService;
    let canvasResizerStub: CanvasResizerService;
    let autoSaveStub: AutomaticSaveService;

    let baseStub: CanvasRenderingContext2D;
    let previewStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    let density: number;
    let color: string;
    let zoneDiameter: number;
    let dropDiameter: number;
    const angle: number[] = [];
    const radius: number[] = [];
    let position: Vec2;

    beforeEach(() => {
        color = '#000000';
        // tslint:disable:no-magic-numbers
        density = 2;
        zoneDiameter = 5;
        // tslint:disable:no-magic-numbers
        dropDiameter = 6;
        // tslint:disable:no-magic-numbers
        position = { x: 10, y: 5 };
        // tslint:disable:no-magic-numbers
        angle.push(3);
        // tslint:disable:no-magic-numbers
        length = 20;
        // tslint:disable:no-magic-numbers
        radius.push(4);

        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);
        undoRedoStub = new UndoRedoService(drawingStub);
        canvasResizerStub = new CanvasResizerService(undoRedoStub);
        autoSaveStub = new AutomaticSaveService(canvasResizerStub, drawingStub);
        sprayStub = new SprayService(drawingStub, colorStub, undoRedoStub, autoSaveStub);
        sprayActionStub = new SprayAction(density, color, zoneDiameter, dropDiameter, angle, radius, position, drawingStub, sprayStub);

        canvas = canvasTestHelper.canvas;
        // tslint:disable:no-magic-numbers
        canvas.width = 100;
        // tslint:disable:no-magic-numbers
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
                { provide: SprayAction, useValue: sprayActionStub },
                { provide: SprayService, useValue: sprayStub },
            ],
        });
        sprayActionStub = TestBed.inject(SprayAction);
        sprayStub = TestBed.inject(SprayService);
    });

    it('fillStyle and lineJoin must be primary color and thickness of sprayAction', () => {
        drawingStub.baseCtx.fillStyle = drawingStub.previewCtx.fillStyle = '#000000';
        sprayActionStub.apply();
        expect(drawingStub.baseCtx.fillStyle).toEqual(color);
    });

    it('should call transform', () => {
        const transformSpy = spyOn(sprayStub, 'transform').and.stub();
        sprayActionStub.apply();
        expect(transformSpy).toHaveBeenCalled();
    });
});
