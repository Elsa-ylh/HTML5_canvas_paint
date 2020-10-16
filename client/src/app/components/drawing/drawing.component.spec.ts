import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { cursorName } from '@app/classes/cursor-name';
import { RESIZE_MIDDLE_LOWER_PROPORTION } from '@app/classes/resize-canvas';
import { Tool } from '@app/classes/tool';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';
import { BrushService } from '@app/services/tools/brush.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { DrawingComponent } from './drawing.component';

class ToolStub extends Tool {}
// tslint:disable:no-any
describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let toolServiceStub: ToolService;
    let canvasResizerStub: CanvasResizerService;

    let pencilStub: PencilService;
    let eraserStub: EraserService;
    let brushStub: BrushService;
    let lineStub: LineService;
    let rectangleStub: RectangleService;
    let ellipseStub: EllipseService;
    let colorStub: ColorService;

    beforeEach(
        waitForAsync(() => {
            drawingStub = new DrawingService();
            canvasResizerStub = new CanvasResizerService();
            colorStub = new ColorService(drawingStub);
            pencilStub = new PencilService(drawingStub, colorStub);
            eraserStub = new EraserService(drawingStub);
            brushStub = new BrushService(drawingStub, colorStub);
            lineStub = new LineService(drawingStub, colorStub);
            rectangleStub = new RectangleService(drawingStub, colorStub);
            ellipseStub = new EllipseService(drawingStub, colorStub);

            toolServiceStub = new ToolService(pencilStub, eraserStub, brushStub, lineStub, rectangleStub, ellipseStub);

            toolStub = toolServiceStub.currentTool;

            TestBed.configureTestingModule({
                declarations: [DrawingComponent],
                imports: [BrowserAnimationsModule, HttpClientModule],
                providers: [
                    { provide: DrawingService, useValue: drawingStub },
                    { provide: ToolService, useValue: toolServiceStub },
                    { provide: CanvasResizerService, useValue: canvasResizerStub },
                ],
            }).compileComponents();

            fixture = TestBed.createComponent(DrawingComponent);
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

    it('should have a default WIDTH and HEIGHT', () => {
        expect(canvasResizerStub.canvasSize.x).toEqual(component.width);
        expect(canvasResizerStub.canvasSize.y).toEqual(component.height);
    });

    it('should get toolStub', () => {
        const currentTool = toolServiceStub.currentTool;
        expect(currentTool).toEqual(toolStub);
    });

    it(" should call the tool's mouse move when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse down when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' should onMouseOut trigger toolService.currentTool.onMouseOut(event)', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseOut').and.callThrough();
        component.onMouseOut(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' should onMouseEnter trigger toolService.currentTool.onMouseEnter(event)', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseEnter').and.callThrough();
        component.onMouseEnter(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(' should onResizeDown trigger verticalAndHorizontal of resize service', () => {
        const event = { offsetX: canvasResizerStub.canvasSize.x, offsetY: canvasResizerStub.canvasSize.y } as MouseEvent;
        const canvasResizeSpy = spyOn(canvasResizerStub, 'onResizeDown').and.callThrough();
        component.onResizeDown(event);
        expect(canvasResizeSpy).toHaveBeenCalled();
        expect(canvasResizerStub.resizeCursor).toBe(cursorName.resizeVerticalAndHorizontal);
    });

    it(' should onResizeDown trigger vertical resize service', () => {
        const event = {
            offsetX: canvasResizerStub.canvasSize.x * RESIZE_MIDDLE_LOWER_PROPORTION + 1,
            offsetY: canvasResizerStub.canvasSize.y + 1,
        } as MouseEvent;
        const canvasResizeSpy = spyOn(canvasResizerStub, 'onResizeDown').and.callThrough();
        component.onResizeDown(event);
        expect(canvasResizeSpy).toHaveBeenCalled();
        expect(canvasResizerStub.resizeCursor).toBe(cursorName.resizeVertical);
    });

    it(' should onResizeDown trigger horizontal resize service', () => {
        const event = {
            offsetX: canvasResizerStub.canvasSize.x + 1,
            offsetY: canvasResizerStub.canvasSize.y * RESIZE_MIDDLE_LOWER_PROPORTION + 1,
        } as MouseEvent;
        const canvasResizeSpy = spyOn(canvasResizerStub, 'onResizeDown').and.callThrough();
        component.onResizeDown(event);
        expect(canvasResizeSpy).toHaveBeenCalled();
        expect(canvasResizerStub.resizeCursor).toBe(cursorName.resizeHorizontal);
    });

    it(' should onResizeMove trigger verticalAndHorizontal preview resize service', () => {
        canvasResizerStub.isResizeDown = true;
        const event = { offsetX: canvasResizerStub.canvasSize.x, offsetY: canvasResizerStub.canvasSize.y } as MouseEvent;
        const canvasResizeSpy = spyOn(canvasResizerStub, 'onResize').and.callThrough();
        component.onResizeMove(event);
        expect(canvasResizeSpy).toHaveBeenCalled();
        expect(canvasResizerStub.resizeCursor).toBe(cursorName.resizeVerticalAndHorizontal);
    });

    it(' should onResizeMove trigger vertical preview resize service', () => {
        canvasResizerStub.isResizeDown = true;
        const event = {
            offsetX: canvasResizerStub.canvasSize.x * RESIZE_MIDDLE_LOWER_PROPORTION + 1,
            offsetY: canvasResizerStub.canvasSize.y + 1,
        } as MouseEvent;
        const canvasResizeSpy = spyOn(canvasResizerStub, 'onResize').and.callThrough();
        component.onResizeMove(event);
        expect(canvasResizeSpy).toHaveBeenCalled();
        expect(canvasResizerStub.resizeCursor).toBe(cursorName.resizeVertical);
    });

    it(' should onResizeMove trigger horizontal preview resize service', () => {
        canvasResizerStub.isResizeDown = true;
        const event = {
            offsetX: canvasResizerStub.canvasSize.x + 1,
            offsetY: canvasResizerStub.canvasSize.y * RESIZE_MIDDLE_LOWER_PROPORTION + 1,
        } as MouseEvent;
        const canvasResizeSpy = spyOn(canvasResizerStub, 'onResize').and.callThrough();
        component.onResizeMove(event);
        expect(canvasResizeSpy).toHaveBeenCalled();
        expect(canvasResizerStub.resizeCursor).toBe(cursorName.resizeHorizontal);
    });

    it(' should onResizeUp trigger resizer service', () => {
        const event = {} as MouseEvent;
        const onResizeUpSpy = spyOn(canvasResizerStub, 'onResizeUp').and.callThrough();
        component.onResizeUp(event);
        expect(onResizeUpSpy).toHaveBeenCalled();
    });

    it(' should onResizeUp trigger resizer service', () => {
        const event = {} as MouseEvent;
        const onResizeOutSpy = spyOn(canvasResizerStub, 'onResizeOut').and.callThrough();
        component.onResizeOut(event);
        expect(onResizeOutSpy).toHaveBeenCalled();
    });
});
