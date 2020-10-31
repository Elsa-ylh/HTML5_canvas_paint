import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { CancasInformation, Label } from '@common/communication/canvas-information';
import { SaveDialogComponent } from './save-dialog.component';
// tslint:disable:no-any
// tslint:disable:no-string-literal
// tslint:disable:no-unused-expression
describe('SaveDialogComponent', () => {
    let component: SaveDialogComponent;
    let fixture: ComponentFixture<SaveDialogComponent>;
    let httpMock: HttpTestingController;
    const isDate: Date = new Date();
    const testCancasInformationAdd: CancasInformation = {
        _id: '',
        name: 'test5',
        width: 0,
        height: 0,
        labels: [{ label: 'label1' }],
        date: isDate,
        picture: 'test5',
    };
    const testCancasInformationAdds = [testCancasInformationAdd];
    const labels: Label[] = [{ label: 'lable1' }, { label: 'label2' }];
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, MatDialogModule, MatIconModule, MatGridListModule, MatIconModule, MatSelectModule, MatFormFieldModule],
            declarations: [SaveDialogComponent],
            providers: [
                HttpClient,
                {
                    provide: ClientServerCommunicationService,
                    useValue: {
                        getAllLabel: () => labels,
                        subscribe: (info: any) => testCancasInformationAdds,
                        resetDatas: () => '',
                        getInformation: () => testCancasInformationAdds,
                        getElementResearch: () => testCancasInformationAdds,
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDialogComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
    });
    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
        httpMock.verify();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
