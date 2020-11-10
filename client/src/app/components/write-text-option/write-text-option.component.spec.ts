import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteTextOptionComponent } from './write-text-option.component';

describe('WriteTextOptionComponent', () => {
    let component: WriteTextOptionComponent;
    let fixture: ComponentFixture<WriteTextOptionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WriteTextOptionComponent],
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
