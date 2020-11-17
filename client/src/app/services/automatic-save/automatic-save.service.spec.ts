import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { AutomaticSaveService } from '@app/servoces/automatic/automatic-save.service';
import { CanvasResizerService } from '@app/servoces/canvas/canvas-resizer.service';
import { DrawingService } from '@app/servoces/drawing/drawing.service';

const KEY_SAVE_CANVAS = 'KeySaveCanvas';
const KEY_SAVE_WIDTH = 'KeySaveWidth';
const KEY_SAVE_HEIGHT = 'KeySaveHeight';
describe('AutomaticSaveService', () => {
    let service: AutomaticSaveService;
    const vec2: Vec2 = { x: 5, y: 6 };
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DrawingService,
                    useValue: { convertBase64ToBaseCanvas: (a: string) => '', convertBaseCanvasToBase64: () => ' ' },
                },
                {
                    provide: CanvasResizerService,
                    useValue: {
                        canvasSize: vec2,
                    },
                },
            ],
        });
        service = TestBed.inject(AutomaticSaveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('not element localStorage', () => {
        window.localStorage.clear();
        const bool = service.check();
        expect(bool).toEqual(false);
    });

    it('element localStorage check get item', () => {
        service.save();
        const bool = service.check();
        expect(bool).toEqual(true);
    });

    it('element localStorage getUpload false', () => {
        window.localStorage.clear();
        const bool = service.getUpload();
        expect(bool).toEqual(false);
    });

    it('element localStorage getUpload true', () => {
        service.save();
        const bool = service.getUpload();
        expect(bool).toEqual(true);
    });
    it('element localStorage getUpload true ', () => {
        window.localStorage.clear();
        window.localStorage.setItem(KEY_SAVE_CANVAS, 'a');
        window.localStorage.setItem(KEY_SAVE_WIDTH, '6');
        window.localStorage.setItem(KEY_SAVE_HEIGHT, '5');

        const bool = service.getUpload();
        expect(service.canvas).toEqual('a');
        expect(service.width).toEqual('6');
        expect(service.height).toEqual('5');
        expect(bool).toEqual(true);
    });
});
