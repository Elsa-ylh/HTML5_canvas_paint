import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CancasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { ClientServerCommunicationService } from './client-server-communication.service';

describe('ClientServerCommunicationService', () => {
    let service: ClientServerCommunicationService;
    let httpMock: HttpTestingController;
    let baseUrl: string;
    const expectedCancasInformations: CancasInformation[] = [
        { _id: '', name: 'test5', labels: [{ label: 'label1' }], width: 0, height: 0, date: new Date('2020-10-08'), picture: 'test5' },
    ];
    beforeEach(() => {
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

    it('should return expected CancasInformations (HttpClient called once)', () => {
        // check the content of the mocked call
        service.getData().subscribe((response: CancasInformation[]) => {
            expect(response[0]._id).toEqual(expectedCancasInformations[0]._id, 'id check');
            expect(response[0].name).toEqual(expectedCancasInformations[0].name, 'name check');
        }, fail);

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(expectedCancasInformations);
    });

    it('selectPictureWithLabel should message return expected CancasInformations (HttpClient called once)', () => {
        const expectedMessage: Message = { body: 'label1', title: 'Labels' };
        // check the content of the mocked call
        service.selectPictureWithLabel(expectedMessage).subscribe((response: CancasInformation[]) => {
            expect(response[0]._id).toEqual(expectedCancasInformations[0]._id, 'id check');
            expect(response[0].name).toEqual(expectedCancasInformations[0].name, 'name check');
        }, fail);

        const req = httpMock.expectOne(baseUrl + '/labels');
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(expectedCancasInformations);
    });

    it('should handle http error safely', () => {
        service.getData().subscribe((response: CancasInformation[]) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('Random error occured'));
    });

    it('should return expected CancasInformation (HttpClient called once)', () => {
        const expectedCancasInformation: CancasInformation = {
            _id: '',
            name: 'test5',
            labels: [{ label: 'label1' }],
            width: 0,
            height: 0,
            date: new Date('2020-10-08'),
            picture: 'test5',
        };
        // check the content of the mocked call
        service.allLabel().subscribe((response: CancasInformation) => {
            expect(response._id).toEqual(expectedCancasInformation._id, 'id check');
            expect(response.name).toEqual(expectedCancasInformation.name, 'name check');
        }, fail);

        const req = httpMock.expectOne(baseUrl + '/all_labels');
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(expectedCancasInformation);
    });
    it('should message return expected CancasInformations (HttpClient called once)', () => {
        const expectedMessage: Message = { body: 'name', title: 'test' };
        // check the content of the mocked call
        service.ElementResearch(expectedMessage).subscribe((response: CancasInformation[]) => {
            expect(response[0]._id).toEqual(expectedCancasInformations[0]._id, 'id check');
            expect(response[0].name).toEqual(expectedCancasInformations[0].name, 'name check');
        }, fail);

        const req = httpMock.expectOne(baseUrl + '/research');
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(expectedCancasInformations);
    });
    it('getAllLabel return 0 label', () => {
        const labels: Label[] = service.getAllLabel();
        expect(labels.length).toEqual(0);
        const req = httpMock.expectOne(baseUrl + '/all_labels');
        expect(req.request.method).toBe('GET');
        // actually send the request
    });
    it('getAllLabel return 0 label is not good id', () => {
        service['information'] = expectedCancasInformations[0];
        const labels: Label[] = service.getAllLabel();
        expect(labels.length).toEqual(0);
        const req = httpMock.expectOne(baseUrl + '/all_labels');
        expect(req.request.method).toBe('GET');
        // actually send the request
    });
    it('getAllLabel return 2 label is good id', () => {
        service['information'] = {
            _id: 'list_of_all_labals',
            name: '',
            labels: [{ label: '' }, { label: '' }],
            width: 0,
            height: 0,
            date: new Date(),
            picture: '',
        };
        const labels: Label[] = service.getAllLabel();
        expect(labels.length).toEqual(2);
        const req = httpMock.expectOne(baseUrl + '/all_labels');
        expect(req.request.method).toBe('GET');
        // actually send the request
    });
});
