/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RotationService } from './rotation.service';
import { SelectionService } from './selection-service';

fdescribe('Service: Rotation', () => {
    let rotationStub: RotationService;
    let drawingServiceMock: jasmine.SpyObj<DrawingService>;
    let selectionMock: jasmine.SpyObj<SelectionService>;
    let event: WheelEvent;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceMock = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx', 'cursorCtx']);
        selectionMock = jasmine.createSpyObj('selectionService', []);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceMock },
                { provide: SelectionService, useValue: selectionMock },
            ],
        });
        rotationStub = TestBed.inject(RotationService);
        // tslint:disable:no-string-literal
        rotationStub['drawingService'].baseCtx = baseCtxStub;
        rotationStub['drawingService'].previewCtx = previewCtxStub;
        drawingServiceMock.baseCtx = baseCtxStub;
        drawingServiceMock.previewCtx = previewCtxStub;

        event = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as WheelEvent;
    });

    it('should be created', () => {
        expect(rotationStub).toBeTruthy();
    });

    it('should call addOrRetract when onWheelScroll', () => {
        drawingServiceMock.baseCtx.fillStyle = 'green';
        drawingServiceMock.baseCtx.fillRect(10, 10, drawingServiceMock.canvas.width, drawingServiceMock.canvas.height);
        const spyaddOrRetract = spyOn(rotationStub, 'addOrRetract').and.stub();
        rotationStub.onWheelScroll(selectionMock, event);
        expect(spyaddOrRetract).toHaveBeenCalled();
    });
});
