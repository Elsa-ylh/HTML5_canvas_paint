import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
// import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SprayService } from '@app/services/tools/spray.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers

describe('SprayService', () => {
    let sprayService: SprayService;
    // let baseStubCtx: CanvasRenderingContext2D;
    // let previewStubCtx: CanvasRenderingContext2D;
    let colorServiceMock: jasmine.SpyObj<ColorService>;
    let drawingServiceMock: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        colorServiceMock = jasmine.createSpyObj('ColorService', ['numeralToHex', 'getColor']);
        drawingServiceMock = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx']);
        // baseStubCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        // previewStubCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        TestBed.configureTestingModule({
            providers: [
                { provide: ColorService, useValue: colorServiceMock },
                { provide: DrawingService, useValue: drawingServiceMock },
            ],
        });
        sprayService = TestBed.inject(SprayService);
        colorServiceMock = TestBed.inject(ColorService) as jasmine.SpyObj<ColorService>;
        drawingServiceMock = TestBed.inject(DrawingService) as jasmine.SpyObj<DrawingService>;
    });

    it('should be created', () => {
        expect(sprayService).toBeTruthy();
    });

    it('should generate random number', () => {
        const numberGenerated = sprayService.generateRandomValue(0, 3);
        expect(numberGenerated).toBeLessThanOrEqual(3);
    });
});
