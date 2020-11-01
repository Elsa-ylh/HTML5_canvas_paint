import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { CancasInformation, Label } from '@common/communication/canvas-information';
import { SaveDialogComponent } from './save-dialog.component';
// tslint:disable:no-any
// tslint:disable:no-string-literal
// tslint:disable:no-unused-expression
// tslint:disable:no-empty
fdescribe('SaveDialogComponent', () => {
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
            imports: [
                HttpClientTestingModule,
                MatDialogModule,
                MatIconModule,
                MatGridListModule,
                MatIconModule,
                MatSelectModule,
                MatFormFieldModule,
                MatInputModule,
                BrowserAnimationsModule,
                MatButtonToggleModule,
            ],
            declarations: [SaveDialogComponent],
            providers: [
                HttpClient,
                {
                    provide: ClientServerCommunicationService,
                    useValue: {
                        getAllLabel: () => labels,
                        // subscribe: (info: any) => testCancasInformationAdds,
                        resetDatas: () => '',
                        getInformation: () => testCancasInformationAdds,
                        getElementResearch: () => testCancasInformationAdds,
                        savePicture: (info: CancasInformation) => Message,
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
    it('test notGoodCharacter', () => {
        expect(component.notGoodCharacter('')).toEqual(false, 'casse vide');
        expect(component.notGoodCharacter('  ')).toEqual(false);
        expect(component.notGoodCharacter(' a_a a_ ')).toEqual(false);
        expect(component.notGoodCharacter(' a a')).toEqual(false);
        expect(component.notGoodCharacter('a ! a')).toEqual(true);
        expect(component.notGoodCharacter('a | a')).toEqual(true);
        expect(component.notGoodCharacter('a # a')).toEqual(true);
        expect(component.notGoodCharacter('a " a')).toEqual(true);
        expect(component.notGoodCharacter("a ' a")).toEqual(true);
        expect(component.notGoodCharacter('a ? a')).toEqual(true);
        expect(component.notGoodCharacter('a & a')).toEqual(true);
        expect(component.notGoodCharacter('a * a')).toEqual(true);
        expect(component.notGoodCharacter('a / a')).toEqual(true);
        expect(component.notGoodCharacter('a $ a')).toEqual(true);
        expect(component.notGoodCharacter('a % a')).toEqual(true);
        expect(component.notGoodCharacter('a - a')).toEqual(true);
    });
    it('test checkName', () => {
        expect(component.checkName('')).toEqual(true);
        expect(component.checkName(' a ')).toEqual(true);
        expect(component.checkName('a')).toEqual(false);
        expect(component.checkName('a_a_a_a')).toEqual(false);
    });
    it('test checkLabel', () => {
        expect(component.checkLabel('')).toEqual(false);
        expect(component.checkLabel(' a ')).toEqual(true);
        expect(component.checkLabel('a')).toEqual(true);
        expect(component.checkLabel('aaaaaaa&')).toEqual(true);
        expect(component.checkLabel('a_a_a_a')).toEqual(false);
    });
    it('test selectionLabel', () => {
        component.ngOnInit();
        component.selectionLabel(labels[0].label);
        expect(component['labelSelect'][0]).toEqual(labels[0].label);
    });
    it('test selectionLabel with the parameter not in liste dataLabel', () => {
        component.ngOnInit();
        component.selectionLabel('label3');
        expect(component['labelSelect'].length).toEqual(1);
    });
    it('test the selectionLabel 3 times with the parameter label1', () => {
        component.selectionLabel(labels[1].label);
        component.selectionLabel(labels[1].label);
        component.selectionLabel(labels[1].label);
        expect(component['labelSelect'][0]).toEqual(labels[1].label);
    });
    it('test the selectionLabel times with the parameter label1', () => {
        component.selectionLabel(labels[0].label);
        component.selectionLabel(labels[1].label);
        component.selectionLabel(labels[0].label);
        expect(component['labelSelect'][0]).toEqual(labels[1].label);
    });
    it('', () => {});
});
