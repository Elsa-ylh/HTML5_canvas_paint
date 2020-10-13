import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
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
        baseUrl = service.HTTP_SERVE_LOCAL;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('retour get url http', () => {
        console.log(service.getData());
    });
});
