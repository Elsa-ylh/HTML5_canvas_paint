import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { CancasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { CarrouselPictureComponent } from './carrousel-picture.component';
describe('CarrouselPictureComponent', () => {
    let component: CarrouselPictureComponent;
    let fixture: ComponentFixture<CarrouselPictureComponent>;
    const informationsService: CancasInformation[] = [];
    const isDate: Date = new Date();
    let addAllDataSpy: jasmine.Spy<any>;
    let addAllLabalSpy: jasmine.Spy<any>;
    const testCancasInformationAdd: CancasInformation = {
        id: '',
        name: 'test5',
        labels: [{ label: 'label1' }],
        date: isDate,
        picture: 'test5',
    };
    const labels: Label[] = [];
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [CarrouselPictureComponent],
            providers: [
                {
                    provide: ClientServerCommunicationService,
                    useValue: {
                        getData: () => [informationsService],
                        selectPictureWithLabel: (message: Message) => informationsService,
                        allLabel: () => testCancasInformationAdd,
                        getAllLabel: () => labels,
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CarrouselPictureComponent);
        component = fixture.componentInstance;
        addAllDataSpy = spyOn<any>(component, 'addAllData').and.callThrough();
        addAllLabalSpy = spyOn<any>(component, 'addAllLabal').and.callThrough();
        component['dataPicture'];
        fixture.detectChanges();
    });
    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });
    it('should create', () => {
        expect(component).toBeTruthy();
        expect(addAllDataSpy).toHaveBeenCalled();
        expect(addAllLabalSpy).toHaveBeenCalled();
    });
    // it('', () => {});
});
