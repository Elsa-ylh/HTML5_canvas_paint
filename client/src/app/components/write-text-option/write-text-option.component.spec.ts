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
        component.ngOnInit();
        expect(component['itBold']).toBeFalse;
        expect(component['itItalic']).toBeFalse;
    });
    it('should', () => {});
});
