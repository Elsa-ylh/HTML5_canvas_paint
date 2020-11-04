import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { CanvasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { of } from 'rxjs';
import { CarrouselPictureComponent } from './dialog-carrousel-picture.component';
// tslint:disable:no-any
// tslint:disable:no-string-literal
// tslint:disable:no-unused-expression
// tslint:disable:no-magic-numbers
fdescribe('CarrouselPictureComponent', () => {
    let component: CarrouselPictureComponent;
    let fixture: ComponentFixture<CarrouselPictureComponent>;
    let drawingStub: DrawingService;
    let undoRedoStub: UndoRedoService;
    let canvasResizerStub: CanvasResizerService;
    const informationsService: CanvasInformation[] = [];
    let httpMock: HttpTestingController;
    const isDate: Date = new Date();
    let addAllDataSpy: jasmine.Spy<any>;
    let addAllLabalSpy: jasmine.Spy<any>;
    let confirmSpy: jasmine.Spy<any>;
    let alertSpy: jasmine.Spy<any>;
    const testCanvasInformationAdd: CanvasInformation = {
        _id: '1111',
        name: 'test5',
        width: 0,
        height: 0,
        labels: [{ label: 'label1' }],
        date: isDate,
        picture: 'test5',
    };
    const allDataTest = [
        { _id: '', name: 'test1', labels: [{ label: 'label1' }], width: 0, height: 0, date: new Date('10/04/2020'), picture: 'test1' },
        {
            _id: '',
            name: 'test2',
            labels: [{ label: 'label1' }, { label: 'label2' }],
            width: 0,
            height: 0,
            date: new Date('10/05/2020'),
            picture: 'test2',
        },
        { _id: '', name: 'test3', labels: [{}], width: 0, height: 0, date: new Date('10/08/2020 15:15:15'), picture: 'test3' },
        { _id: '', name: 'test4', labels: [{ label: 'label2' }], width: 0, height: 0, date: new Date('10/08/2020'), picture: 'test4' },
    ] as CanvasInformation[];
    const messageSuccess = { title: 'string', body: 'string' } as Message;
    const testCanvasInformationAdds = [testCanvasInformationAdd];
    const labels: Label[] = [{ label: 'lable1' }, { label: 'label2' }];
    beforeEach(async () => {
        drawingStub = new DrawingService();
        undoRedoStub = new UndoRedoService(drawingStub);
        canvasResizerStub = new CanvasResizerService(undoRedoStub);
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
                { provide: MatDialogRef, useValue: { close: () => '' } },
                { provide: Router, useValue: { navigate: () => '' } },
                { provide: CanvasResizerService, useValue: canvasResizerStub },
                {
                    provide: ClientServerCommunicationService,
                    useValue: {
                        getData: () => [informationsService],
                        selectPictureWithLabel: () => informationsService,
                        allLabel: () => testCanvasInformationAdd,
                        getAllLabel: () => labels,
                        subscribe: (info: any) => testCanvasInformationAdds,
                        resetDatas: () => '',
                        getInformation: () => testCanvasInformationAdds,
                        getElementResearch: () => testCanvasInformationAdds,
                        deleteQuery: () => messageSuccess,
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CarrouselPictureComponent);
        component = fixture.componentInstance;
        spyOn(component['clientServerComSvc'], 'getData').and.returnValue(of(testCanvasInformationAdds));
        spyOn(component['clientServerComSvc'], 'deleteQuery').and.returnValue(of(messageSuccess));
        confirmSpy = spyOn<any>(window, 'confirm').and.callThrough();
        alertSpy = spyOn<any>(window, 'alert').and.callThrough();
        // spyOn(component['clientServerComSvc'], 'getElementResearch').and.returnValue(of([testCanvasInformationAdd]));
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
        component['dataPicture'] = [testCanvasInformationAdd];
        expect(component.getPicturesAll()[0].name).toEqual(testCanvasInformationAdd.name);
    });
    it('test selectionLabel', () => {
        spyOn(component['clientServerComSvc'], 'selectPictureWithLabel').and.returnValue(of([testCanvasInformationAdd]));
        component.ngOnInit();
        component.selectionLabel('label1');
        expect(component['dataPicture'][0].name).toEqual(testCanvasInformationAdd.name);
    });
    it('test selectionLabel with the parameter not in liste dataLabel', () => {
        spyOn(component['clientServerComSvc'], 'selectPictureWithLabel').and.returnValue(of([]));
        component.ngOnInit();
        component.selectionLabel('label3');
        expect(component['dataPicture'].length).toEqual(0);
    });
    it('test the selectionLabel 3 times with the parameter label1', () => {
        spyOn(component['clientServerComSvc'], 'selectPictureWithLabel').and.returnValue(of([testCanvasInformationAdd]));
        component.dataLabel = labels;
        component.selectionLabel(labels[1].label);
        component.selectionLabel(labels[1].label);
        component.selectionLabel(labels[1].label);
        expect(component['dataPicture'][0].name).toEqual(testCanvasInformationAdd.name);
    });
    it('test the selectionLabel times with the parameter label1', () => {
        spyOn(component['clientServerComSvc'], 'selectPictureWithLabel').and.returnValue(of([testCanvasInformationAdd]));
        component.dataLabel = labels;
        component.selectionLabel(labels[0].label);
        component.selectionLabel(labels[1].label);
        component.selectionLabel(labels[0].label);
        expect(component['dataPicture'][0].name).toEqual(testCanvasInformationAdd.name);
    });
    it('check if the refresh function call addAllLabel', () => {
        component.refresh();
        expect(component['addAllLabal']).toHaveBeenCalled;
    });
    it('should setSearchCriteria ', () => {
        spyOn(component['clientServerComSvc'], 'getElementResearch').and.returnValue(of([testCanvasInformationAdd]));
        component.setSearchCriteria();
        expect(component['dataPicture'][0].name).toEqual(testCanvasInformationAdd.name);
    });
    it('should setSearchCriteria date searchCriteria', () => {
        component.selectedType = 'date';
        spyOn(component['clientServerComSvc'], 'getElementResearch').and.returnValue(of([testCanvasInformationAdd]));
        component.setSearchCriteria();
        expect(component['dataPicture'][0].name).toEqual(testCanvasInformationAdd.name);
    });
    it('should setSearchCriteria date and new FormControl', () => {
        component.selectedType = 'date';
        component.myDate = new FormControl(testCanvasInformationAdd);
        spyOn(component['clientServerComSvc'], 'getElementResearch').and.returnValue(of([testCanvasInformationAdd]));
        component.setSearchCriteria();
        expect(component['dataPicture'][0].name).toEqual(testCanvasInformationAdd.name);
    });
    it('should prior', () => {
        component['dataPicture'] = allDataTest;
        component.prior();
        expect(component['position']).toEqual(component['dataPicture'].length - 1);
    });
    it('should next', () => {
        component.next();
        expect(component['position']).toEqual(1);
    });
    it('should next 8 ', () => {
        component['dataPicture'] = allDataTest;
        component.next();
        component.next();
        component.next();
        component.next();
        component.next();
        component.next();
        component.next();
        expect(component['position']).toEqual(3);
    });
    it('should prior 2', () => {
        component['dataPicture'] = allDataTest;
        component.prior();
        component.prior();
        expect(component['position']).toEqual(2);
    });
    it('should prior next', () => {
        component['dataPicture'] = allDataTest;
        component.prior();
        component.next();
        expect(component['position']).toEqual(0);
    });
    it('should getPictures', () => {
        component['dataPicture'] = allDataTest;

        const element = component.getPictures();

        expect(element.length).toEqual(3);
    });
    it('should getPictures', () => {
        component['dataPicture'] = [];
        const element = component.getPictures();

        expect(element.length).toEqual(0);
    });
    it('should getPictures', () => {
        component['dataPicture'] = allDataTest;
        component.prior();
        const element = component.getPictures();

        expect(element[0].name).toEqual(allDataTest[2].name);
        expect(element[1].name).toEqual(allDataTest[3].name);
        expect(element[2].name).toEqual(allDataTest[0].name);
    });
    it('should getPictures', () => {
        component['dataPicture'] = allDataTest;
        component.next();
        const element = component.getPictures();

        expect(element[0].name).toEqual(allDataTest[0].name);
        expect(element[1].name).toEqual(allDataTest[1].name);
        expect(element[2].name).toEqual(allDataTest[2].name);
    });
    it('should loadPicture', () => {
        confirmSpy.and.returnValue(true);
        component.loadPicture(allDataTest[0]);
        expect(confirmSpy).toHaveBeenCalled();
    });
    it('should loadPicture', () => {
        confirmSpy.and.returnValue(false);
        component.loadPicture(allDataTest[0]);
        expect(confirmSpy).toHaveBeenCalled();
    });
    it('should deletePicture', () => {
        confirmSpy.and.returnValue(true);
        component.deletePicture(testCanvasInformationAdd);
        expect(confirmSpy).toHaveBeenCalledWith('Suprimer : ' + testCanvasInformationAdd.name);
    });
    it('should deletePicture', () => {
        confirmSpy.and.returnValue(false);
        component.deletePicture(allDataTest[0]);
        expect(confirmSpy).toHaveBeenCalledWith('Suprimer : ' + allDataTest[0].name);
    });
    it('should deletePicture', () => {
        component.messageDelite(messageSuccess);
        expect(alertSpy).toHaveBeenCalledWith(messageSuccess.body);
    });
});
