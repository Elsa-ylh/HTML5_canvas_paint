import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { CancasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { CarrouselPictureComponent } from './carrousel-picture.component';

fdescribe('CarrouselPictureComponent', () => {
    let component: CarrouselPictureComponent;
    let fixture: ComponentFixture<CarrouselPictureComponent>;
    const informationsService: CancasInformation[] = [];
    let httpMock: HttpTestingController;
    const isDate: Date = new Date();
    let addAllDataSpy: jasmine.Spy<any>;
    let addAllLabalSpy: jasmine.Spy<any>;
    // let subcribeSpy: jasmine.Spy<any>;
    // let communicationService: ClientServerCommunicationService;
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
            imports: [HttpClientTestingModule],
            declarations: [CarrouselPictureComponent],
            providers: [
                HttpClient,
                {
                    provide: ClientServerCommunicationService,
                    useValue: {
                        getData: () => [informationsService],
                        selectPictureWithLabel: (message: Message) => informationsService,
                        allLabel: () => testCancasInformationAdd,
                        getAllLabel: () => labels,
                        subscribe: (info: any) => {
                            [testCancasInformationAdd];
                        },
                        resetDatas: () => {},
                        getInformation: () => [testCancasInformationAdd],
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(CarrouselPictureComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        addAllDataSpy = spyOn<any>(component, 'addAllData').and.callThrough();
        addAllLabalSpy = spyOn<any>(component, 'addAllLabal').and.callThrough();
        //   subcribeSpy = spyOn<any>(component, 'subscribe').and.returnValue(Promise.resolve([testCancasInformationAdd]));
        component['dataPicture'];
        fixture.detectChanges();
    });
    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });
    afterEach(() => {
        httpMock.verify();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('test reset', () => {
        component.reset();
        expect(addAllDataSpy).toHaveBeenCalled();
        expect(addAllLabalSpy).toHaveBeenCalled();
    });
    it('', (done) => {
        const service = TestBed.get(ClientServerCommunicationService);
        expect(component.getPicturesAll()).toBeDefined();
        spyOn(component, 'selectionLabel');
        component.selectionLabel('');
        service.selectPictureWithLabel.subscribe((all: any) => {
            expect(all).toEqual('');
            done();
        });
    });
    /*it('', () => {
        const service = TestBed.get(ClientServerCommunicationService); // get your service
        //spyOn(service, 'selectPictureWithLabel').and.callThrough(); // create spy
        component.selectionLabel('label1');
        expect(service.selectPictureWithLabel).toHaveBeenCalledWith();
    });*/
});
