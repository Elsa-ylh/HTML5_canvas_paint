// import { TestBed } from '@angular/core/testing';
// import { canvasTestHelper } from '@app/classes/canvas-test-helper';
// import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
// import { ColorService } from '@app/services/color/color.service';
// import { DrawingService } from '@app/services/drawing/drawing.service';
// import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
// import { CanvasInformation } from '@common/communication/canvas-information';
// import { LoadAction } from './load-action';

// // tslint:disable:no-magic-numbers
// describe('resizeCanvasAction', () => {
//     let loadActionStub: LoadAction;
//     let drawingStub: DrawingService;
//     let colorStub: ColorService;
//     let undoRedoStub: UndoRedoService;
//     let resizeStub: CanvasResizerService;

//     let picture: CanvasInformation;
//     let height: number;
//     let width: number;

//     let baseStub: CanvasRenderingContext2D;
//     let previewStub: CanvasRenderingContext2D;
//     let canvas: HTMLCanvasElement;

//     beforeEach(() => {
//         event = {
//             offsetX: 25,
//             offsetY: 10,
//         } as MouseEvent;

//         // picture = new Image();
//         height = 3;
//         width = 2;

//         drawingStub = new DrawingService();
//         colorStub = new ColorService(drawingStub);
//         undoRedoStub = new UndoRedoService(drawingStub);
//         resizeStub = new CanvasResizerService(undoRedoStub);
//         canvas = canvasTestHelper.canvas;
//         // tslint:disable:no-magic-numbers
//         canvas.width = 100;
//         // tslint:disable:no-magic-numbers
//         canvas.height = 100;

//         baseStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
//         previewStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

//         drawingStub.canvas = canvas;
//         drawingStub.baseCtx = baseStub;
//         drawingStub.previewCtx = previewStub;

//         TestBed.configureTestingModule({
//             providers: [
//                 { provide: DrawingService, useValue: drawingStub },
//                 { provide: ColorService, useValue: colorStub },
//                 { provide: UndoRedoService, useValue: undoRedoStub },
//                 { provide: LoadAction, useValue: loadActionStub },
//                 { provide: CanvasResizerService, useValue: resizeStub },
//             ],
//         });
//         loadActionStub = TestBed.inject(LoadAction);
//         resizeStub = TestBed.inject(CanvasResizerService);
//     });

//     it('should call onResizeUp', () => {
//         const convertBaseSpy = spyOn(drawingStub, 'convertBase64ToBaseCanvas').and.stub();
//         loadActionStub.apply();
//         expect(convertBaseSpy).toHaveBeenCalled();
//     });
// });
