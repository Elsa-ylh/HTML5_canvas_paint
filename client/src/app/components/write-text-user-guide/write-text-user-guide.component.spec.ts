import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WriteTextUserGuideComponent } from './write-text-user-guide.component';

describe('WriteTextUserGuideComponent', () => {
    let component: WriteTextUserGuideComponent;
    let fixture: ComponentFixture<WriteTextUserGuideComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WriteTextUserGuideComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WriteTextUserGuideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
