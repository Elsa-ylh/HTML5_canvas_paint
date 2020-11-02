/* tslint:disable:no-unused-variable */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorService } from '@app/services/color/color.service';
import { PaintBucketColorComponent } from './paint-bucket-color.component';

describe('PaintBucketColorComponent', () => {
    let component: PaintBucketColorComponent;
    let fixture: ComponentFixture<PaintBucketColorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PaintBucketColorComponent],
            imports: [MatGridListModule, MatButtonToggleModule, MatButtonModule, MatListModule, BrowserAnimationsModule, HttpClientModule],
            providers: [{ provide: ColorService, useValue: {} }],
        }).compileComponents();
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
