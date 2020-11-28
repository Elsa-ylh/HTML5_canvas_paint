import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLineModule, MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextService } from '@app/services/tools/text.service';
import { WriteTextOptionComponent } from './write-text-option.component';
// tslint:disable:no-magic-numbers
// tslint:disable:no-unused-expression
// tslint:disable:no-string-literal
// tslint:disable:no-empty
describe('WriteTextOptionComponent', () => {
    let component: WriteTextOptionComponent;
    let fixture: ComponentFixture<WriteTextOptionComponent>;
    const event = new KeyboardEvent('window:keydown.control.a', {});
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatDialogModule,
                MatIconModule,
                MatGridListModule,
                MatFormFieldModule,
                MatOptionModule,
                MatSelectModule,
                FormsModule,
                MatLineModule,
                MatButtonToggleModule,
                BrowserAnimationsModule,
            ],
            declarations: [WriteTextOptionComponent],
            providers: [
                {
                    provide: TextService,
                    useValue: {
                        possibleSizeFont: [20, 22, 24, 26, 28, 30, 23, 34, 36, 38, 40, 48, 60, 72],
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
                        arrowTop: () => '',
                        arrowBottom: () => '',
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

    it('should ngOnInit', () => {
        expect(component['itBold']).toBeFalse;
        expect(component['itItalic']).toBeFalse;
    });
    it('should', () => {
        component.pickBold();
        expect(component['itBold']).toBeTrue;
        component.pickBold();
        expect(component['itBold']).toBeFalse;
    });
    it('should', () => {
        component.pickItalic();
        expect(component['itItalic']).toBeFalse;
        component.pickItalic();
        expect(component['itItalic']).toBeFalse;
    });

    it('should', () => {
        component.pickFontStyle(0);
    });

    it('should keyUpHandler', () => {
        component.keyUpHandler(event);
    });
    it('should onLeftArrow', () => {
        component.onLeftArrow(event);
    });
    it('should onRightArrow', () => {
        component.onRightArrow(event);
    });
    it('should onEnter', () => {
        component.onEnter(event);
    });
    it('should onDelete', () => {
        component.onDelete(event);
    });
    it('should onBackSpace', () => {
        component.onBackSpace(event);
    });
    it('should onTopArrow', () => {
        component.onTopArrow(event);
    });
    it('should onBottomArrow', () => {
        component.onBottomArrow(event);
    });
    it('should onEscape', () => {
        component.onEscape(event);
    });
});
