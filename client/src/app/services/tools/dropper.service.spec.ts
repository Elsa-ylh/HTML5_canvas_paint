import { TestBed } from '@angular/core/testing';
import { MouseButton } from '@app/classes/mouse-button';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DropperService } from '@app/services/tools/dropper.service';

describe('DropperService', () => {
    let dropperService: DropperService;
    let colorServiceMock: jasmine.SpyObj<ColorService>;

    beforeEach(() => {
        const colorSpy = jasmine.createSpyObj('ColorService', ['numeralToHex', 'getColor']);
        const drawingSpy = jasmine.createSpyObj('DrawingService', ['baseCtx', 'previewCtx']);
        TestBed.configureTestingModule({
            providers: [
                { provide: ColorService, useValue: colorSpy },
                { provide: DrawingService, useValue: drawingSpy },
            ],
        });
        dropperService = TestBed.inject(DropperService);
        colorServiceMock = TestBed.inject(ColorService) as jasmine.SpyObj<ColorService>;
    });

    it('should be created', () => {
        expect(dropperService).toBeTruthy();
    });

    it('should be called', () => {
        const mouseEvent = { x: 15, y: 6, button: MouseButton.Left } as MouseEvent;
        dropperService.onMouseDown(mouseEvent);
        expect(colorServiceMock.getColor).toHaveBeenCalled();
    });
    it('should should be called', () => {
        const mouseEvent = { x: 15, y: 6, button: MouseButton.Left } as MouseEvent;
        dropperService.onMouseDown(mouseEvent);
        expect(colorServiceMock.numeralToHex).toHaveBeenCalled();
    });

    it('should be called', () => {
        const mouseEvent = { x: 15, y: 6, button: MouseButton.Right } as MouseEvent;
        dropperService.onMouseDown(mouseEvent);
        expect(colorServiceMock.getColor).toHaveBeenCalled();
    });
    it('should should be called', () => {
        const mouseEvent = { x: 15, y: 6, button: MouseButton.Right } as MouseEvent;
        dropperService.onMouseDown(mouseEvent);
        expect(colorServiceMock.numeralToHex).toHaveBeenCalled();
    });
});
