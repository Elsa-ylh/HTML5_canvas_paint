import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { CanvasResizerService } from '../canvas/canvas-resizer.service';
import { DrawingService } from '../drawing/drawing.service';
import { AutoSaveService } from './auto-save.service';

const KEY_SAVE_CANVAS = 'KeySaveCanvas';
const KEY_SAVE_WIDTH = 'KeySaveWidth';
const KEY_SAVE_HEIGHT = 'KeySaveHeight';
fdescribe('AutoSaveService', () => {
    let service: AutoSaveService;
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
        service = TestBed.inject(AutoSaveService);
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
    it('element localStorage getUpload false ', () => {
        window.localStorage.clear();
        window.localStorage.setItem(KEY_SAVE_CANVAS, 'a');
        window.localStorage.setItem(KEY_SAVE_WIDTH, 'b');
        window.localStorage.setItem(KEY_SAVE_HEIGHT, 'c');
        service.check();
        console.log(service['canvas']);
        console.log(service['width']);
        console.log(service['height']);
        const bool = service.getUpload();
        expect(bool).toEqual(false);
    });
});
