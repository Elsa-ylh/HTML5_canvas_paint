import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CancasInformation } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { ClientServerCommunicationService } from './client-server-communication.service';

fdescribe('ClientServerCommunicationService', () => {
    let service: ClientServerCommunicationService;
    let httpMock: HttpTestingController;
    let baseUrl: string;
    // let httpClient: HttpClient;
    beforeEach(() => {
        // httpClient = new HttpClient(new HttpHandler());
        // service = new ClientServerCommunicationService(httpClient);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(ClientServerCommunicationService);
        httpMock = TestBed.inject(HttpTestingController);
        // tslint:disable: no-string-literal
        baseUrl = service['HTTP_SERVE_LOCAL'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return expected message (HttpClient called once)', () => {
        const expectedCancasInformation: CancasInformation[] = [
            { id: '', name: 'test5', labels: [{ label: 'label1' }], date: '2020-10-08', picture: 'test5' },
        ];

        // check the content of the mocked call
        service.getData().subscribe((response: CancasInformation[]) => {
            expect(response[0].id).toEqual(expectedCancasInformation[0].id, 'Title check');
            expect(response[0].name).toEqual(expectedCancasInformation[0].name, 'body check');
        }, fail);

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(expectedCancasInformation);
    });

    it('should return expected message (HttpClient called once)', () => {
        const expectedCancasInformation: CancasInformation[] = [
            { id: '', name: 'test5', labels: [{ label: 'label1' }], date: '2020-10-08', picture: 'test5' },
        ];
        const expectedMessage: Message = { body: 'label1', title: 'Labels' };
        // check the content of the mocked call
        service.poshData(expectedMessage).subscribe((response: CancasInformation[]) => {
            expect(response[0].id).toEqual(expectedCancasInformation[0].id, 'id check');
            expect(response[0].name).toEqual(expectedCancasInformation[0].name, 'name check');
        }, fail);

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('basicPost');
        // actually send the request
        req.flush(expectedCancasInformation);
    });
});
