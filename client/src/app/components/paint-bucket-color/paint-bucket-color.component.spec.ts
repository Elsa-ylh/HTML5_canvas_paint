/* tslint:disable:no-unused-variable */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PaintBucketColorComponent } from './paint-bucket-color.component';

describe('PaintBucketColorComponent', () => {
    let component: PaintBucketColorComponent;
    let fixture: ComponentFixture<PaintBucketColorComponent>;

    let drawingStub: DrawingService;
    let colorStub: ColorService;

    beforeEach(async () => {
        drawingStub = new DrawingService();
        colorStub = new ColorService(drawingStub);

        await TestBed.configureTestingModule({
            declarations: [PaintBucketColorComponent],
            imports: [
                MatGridListModule,
                MatDialogModule,
                MatButtonToggleModule,
                MatButtonModule,
                MatListModule,
                BrowserAnimationsModule,
                HttpClientModule,
            ],
            providers: [{ provide: ColorService, useValue: colorStub }],
        }).compileComponents();
        TestBed.inject(DomSanitizer);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PaintBucketColorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
