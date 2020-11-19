/* tslint:disable:no-unused-variable */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasInformation, Label } from '@common/communication/canvas-information';
import { DialogExportEmailComponent } from './dialog-export-email.component';

describe('DialogExportEmailComponent', () => {
    let component: DialogExportEmailComponent;
    let fixture: ComponentFixture<DialogExportEmailComponent>;

    let drawingStub: DrawingService;

    beforeEach(
        waitForAsync(() => {
            drawingStub = new DrawingService();
            const canvas = document.createElement('canvas');
            drawingStub.canvas = canvas;
            drawingStub.baseCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

            const previewCanvas = document.createElement('canvas');
            drawingStub.previewCtx = previewCanvas.getContext('2d') as CanvasRenderingContext2D;

            const dropperCanvas = document.createElement('canvas');
            drawingStub.dropperCtx = dropperCanvas.getContext('2d') as CanvasRenderingContext2D;

            const isDate: Date = new Date();
            const testCanvasInformationAdd: CanvasInformation = {
                _id: '',
                name: 'test5',
                width: 0,
                height: 0,
                labels: [{ label: 'label1' }],
                date: isDate,
                picture: 'test5',
            };
            const testCanvasInformationAdds = [testCanvasInformationAdd];
            const labels: Label[] = [{ label: 'lable1' }, { label: 'label2' }];

            TestBed.configureTestingModule({
                imports: [
                    MatDialogModule,
                    MatButtonModule,
                    MatButtonToggleModule,
                    MatGridListModule,
                    MatInputModule,
                    FormsModule,
                    BrowserAnimationsModule,
                    HttpClientTestingModule,
                    ReactiveFormsModule,
                ],
                declarations: [DialogExportEmailComponent],
                providers: [
                    HttpClient,
                    {
                        provide: ClientServerCommunicationService,
                        useValue: {
                            getAllLabel: () => labels,
                            resetDatas: () => '',
                            getInformation: () => testCanvasInformationAdds,
                            getElementResearch: () => testCanvasInformationAdds,
                            savePicture: () => Message,
                        },
                    },
                    {
                        provide: DrawingService,
                        useValue: { convertBaseCanvasToBase64: () => 'image_test' },
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogExportEmailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
