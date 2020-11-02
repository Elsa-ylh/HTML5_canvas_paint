import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { CancasInformation, Label } from '@common/communication/canvas-information';
import { of } from 'rxjs';
import { CarrouselPictureComponent } from './dialog-carrousel-picture.component';
// tslint:disable:no-any
// tslint:disable:no-string-literal
// tslint:disable:no-unused-expression
describe('CarrouselPictureComponent', () => {
    let component: CarrouselPictureComponent;
    let fixture: ComponentFixture<CarrouselPictureComponent>;
    const informationsService: CancasInformation[] = [];
    let httpMock: HttpTestingController;
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
    const testCancasInformationAdds = [testCancasInformationAdd];
    const labels: Label[] = [{ label: 'lable1' }, { label: 'label2' }];
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                MatDialogModule,
                MatIconModule,
                MatGridListModule,
                MatFormFieldModule,
                MatOptionModule,
                MatSelectModule,
            ],
            declarations: [CarrouselPictureComponent],
            providers: [
                HttpClient,
                {
                    provide: ClientServerCommunicationService,
                    useValue: {
                        getData: () => [informationsService],
                        selectPictureWithLabel: () => informationsService,
                        allLabel: () => testCancasInformationAdd,
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
        fixture = TestBed.createComponent(CarrouselPictureComponent);
        component = fixture.componentInstance;
        spyOn(component['clientServerCommunicationService'], 'getData').and.returnValue(of([testCancasInformationAdd]));
        // spyOn(component['clientServerCommunicationService'], 'getElementResearch').and.returnValue(of([testCancasInformationAdd]));
        httpMock = TestBed.inject(HttpTestingController);

        addAllDataSpy = spyOn<any>(component, 'addAllData').and.callThrough();
        addAllLabalSpy = spyOn<any>(component, 'addAllLabal').and.callThrough();
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

    it('test reset', () => {
        component.reset();
        expect(addAllDataSpy).toHaveBeenCalled();
        expect(addAllLabalSpy).toHaveBeenCalled();
    });
    it('test ngOnInit', () => {
        component.ngOnInit();
        expect(addAllDataSpy).toHaveBeenCalled();
        expect(addAllLabalSpy).toHaveBeenCalled();
    });

    it('test getPicturesAll', () => {
        component['dataPicture'] = [testCancasInformationAdd];
        expect(component.getPicturesAll()[0].name).toEqual(testCancasInformationAdd.name);
    });
    it('test selectionLabel', () => {
        spyOn(component['clientServerCommunicationService'], 'selectPictureWithLabel').and.returnValue(of([testCancasInformationAdd]));
        component.ngOnInit();
        component.selectionLabel('label1');
        expect(component['dataPicture'][0].name).toEqual(testCancasInformationAdd.name);
    });
    it('test selectionLabel with the parameter not in liste dataLabel', () => {
        spyOn(component['clientServerCommunicationService'], 'selectPictureWithLabel').and.returnValue(of([]));
        component.ngOnInit();
        component.selectionLabel('label3');
        expect(component['dataPicture'].length).toEqual(0);
    });
    it('test the selectionLabel 3 times with the parameter label1', () => {
        spyOn(component['clientServerCommunicationService'], 'selectPictureWithLabel').and.returnValue(of([testCancasInformationAdd]));
        component.dataLabel = labels;
        component.selectionLabel(labels[1].label);
        component.selectionLabel(labels[1].label);
        component.selectionLabel(labels[1].label);
        expect(component['dataPicture'][0].name).toEqual(testCancasInformationAdd.name);
    });
    it('test the selectionLabel times with the parameter label1', () => {
        spyOn(component['clientServerCommunicationService'], 'selectPictureWithLabel').and.returnValue(of([testCancasInformationAdd]));
        component.dataLabel = labels;
        component.selectionLabel(labels[0].label);
        component.selectionLabel(labels[1].label);
        component.selectionLabel(labels[0].label);
        expect(component['dataPicture'][0].name).toEqual(testCancasInformationAdd.name);
    });
    it('check if the refresh function call addAllLabel', () => {
        component.refresh();
        expect(component['addAllLabal']).toHaveBeenCalled;
    });
    it('', () => {
        spyOn(component['clientServerCommunicationService'], 'getElementResearch').and.returnValue(of([testCancasInformationAdd]));
        component.setSearchCriteria();
        expect(component['dataPicture'][0].name).toEqual(testCancasInformationAdd.name);
    });
    it('', () => {
        component.selectedType = 'date';
        spyOn(component['clientServerCommunicationService'], 'getElementResearch').and.returnValue(of([testCancasInformationAdd]));
        component.setSearchCriteria();
        expect(component['dataPicture'][0].name).toEqual(testCancasInformationAdd.name);
    });
    it('', () => {
        component.selectedType = 'date';
        component.myDate = new FormControl(testCancasInformationAdd);
        spyOn(component['clientServerCommunicationService'], 'getElementResearch').and.returnValue(of([testCancasInformationAdd]));
        component.setSearchCriteria();
        expect(component['dataPicture'][0].name).toEqual(testCancasInformationAdd.name);
    });
});
