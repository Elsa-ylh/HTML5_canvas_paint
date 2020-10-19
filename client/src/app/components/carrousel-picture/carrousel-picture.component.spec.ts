import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { CancasInformation } from '@common/communication/canvas-information';
import { CarrouselPictureComponent } from './carrousel-picture.component';
describe('CarrouselPictureComponent', () => {
    let component: CarrouselPictureComponent;
    let fixture: ComponentFixture<CarrouselPictureComponent>;
    const informationService: CancasInformation[] = [];
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ClientServerCommunicationService],
            declarations: [CarrouselPictureComponent],
            providers: [{ provide: ClientServerCommunicationService, useValue: { getData: () => informationService } }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CarrouselPictureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
