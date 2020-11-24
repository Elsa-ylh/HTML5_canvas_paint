import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextService } from '@app/services/tools/text.service';
import { WriteTextOptionComponent } from './write-text-option.component';

describe('WriteTextOptionComponent', () => {
    let component: WriteTextOptionComponent;
    let fixture: ComponentFixture<WriteTextOptionComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WriteTextOptionComponent],
            providers: [
                {
                    provide: TextService,
                    useValue: {
                        possibleSizeFont: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72],
                        fontStyleBold: false,
                        fontStyleItalic: false,
                        selectTextPosition: () => '',
                        setBold: () => '',
                        setItalic: () => '',
                        keyUpHandler: () => '',
                        arrowLeft: () => '',
                        arrowRight: () => '',
                        enter: () => '',
                        clearEffectTool: () => '',
                        delete: () => '',
                        backspace: () => '',
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WriteTextOptionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
