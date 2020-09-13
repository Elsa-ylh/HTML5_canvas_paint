/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { DrawingService } from '@app/services/drawing/drawing.service';
// import { By } from '@angular/platform-browser';
// import { DebugElement } from '@angular/core';

import { DialogNewDrawingComponent } from './dialog-new-drawing.component';

describe('DialogNewDrawingComponent', () => {
    let component: DialogNewDrawingComponent;
    let fixture: ComponentFixture<DialogNewDrawingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            // imports: [DrawingService],
            declarations: [DialogNewDrawingComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogNewDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
