// tslint:disable:no-magic-numbers
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadAction } from '@app/classes/undo-redo/load-action';
import { AutomaticSaveService } from '@app/services/automatic-save/automatic-save.service';
// import { LoadAction } from '@app/classes/undo-redo/load-action';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { CanvasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
const NB_FILES_OPEN_AT_A_TIME = 3;
@Component({
    selector: 'app-dialog-carrousel-picture',
    templateUrl: './dialog-carrousel-picture.component.html',
    styleUrls: ['./dialog-carrousel-picture.component.scss'],
})
export class CarrouselPictureComponent implements OnInit {
    constructor(
        private clientServerComSvc: ClientServerCommunicationService,
        private cvsResizerService: CanvasResizerService,
        private drawingService: DrawingService,
        private router: Router,
        private dialogRef: MatDialogRef<CarrouselPictureComponent>,
        private undoRedoService: UndoRedoService,
        private automaticSaveService: AutomaticSaveService,
    ) {}
    private dataPicture: CanvasInformation[] = [];
    private position: number = 0;
    dataLabel: Label[] = [];
    private labelSelect: string[] = [];
    selectedType: string = 'name';
    name: string;
    myDate: FormControl = new FormControl(new Date());
    threePictures: CanvasInformation[] = [];
    @ViewChild('previewImage1', { static: false }) previewImage1: ElementRef<HTMLImageElement>;
    @ViewChild('previewImage2', { static: false }) previewImage2: ElementRef<HTMLImageElement>;
    @ViewChild('previewImage3', { static: false }) previewImage3: ElementRef<HTMLImageElement>;

    ngOnInit(): void {
        this.addAllData();
        this.addAllLabels();
    }
    private addAllData(): void {
        this.clientServerComSvc.getData().subscribe((info) => (this.dataPicture = info));
    }

    private addAllLabels(): void {
        this.dataLabel = this.clientServerComSvc.getAllLabel();
    }

    reset(): void {
        this.addAllLabels();
        this.addAllData();
        this.labelSelect = [];
        this.name = '';
        this.myDate = new FormControl(new Date());
    }
    refresh(): void {
        this.addAllLabels();
        this.labelSelect = [];
        this.addAllData();
    }
    selectionLabel(label: string): void {
        let itList = true;
        for (let index = 0; index < this.labelSelect.length; index++) {
            if (this.labelSelect[index] === label) {
                this.labelSelect.splice(index, 1);
                itList = false;
            }
        }
        if (itList) {
            this.labelSelect.push(label);
        }
        this.labelSelect.length === 0 ? this.addAllData() : this.setMessageLabel(this.labelSelect);
    }
    private setMessageLabel(labels: string[]): void {
        let textLabel = '';
        for (let index = 0; index < labels.length; index++) {
            textLabel += index === labels.length - 1 ? labels[index] : labels[index] + ',';
        }
        this.position = 0;
        const message: Message = { title: 'labels', body: textLabel };
        this.clientServerComSvc.selectPictureWithLabel(message).subscribe((info) => (this.dataPicture = info));
    }
    getPicturesAll(): number {
        return this.dataPicture.length;
    }
    setSearchCriteria(): void {
        switch (this.selectedType) {
            case 'name':
                const message: Message = { title: 'name', body: this.name };
                this.clientServerComSvc.getElementResearch(message).subscribe((info) => (this.dataPicture = info));
                break;
            case 'date':
                const messageDate: Message = { title: 'date', body: (this.myDate.value as Date).toString() };
                this.clientServerComSvc.getElementResearch(messageDate).subscribe((info) => (this.dataPicture = info));
                break;
        }
        this.position = 0;
    }
    prior(): void {
        if (this.position === 0) {
            this.position = this.dataPicture.length - 1;
        } else this.position--;
    }
    next(): void {
        if (this.position === this.dataPicture.length - 1) {
            this.position = 0;
        } else this.position++;
    }

    getPictures(): CanvasInformation[] {
        this.threePictures = [];
        if (this.dataPicture.length <= NB_FILES_OPEN_AT_A_TIME) {
            this.threePictures = this.dataPicture;
            this.createImage(this.threePictures);
            return this.threePictures;
        }

        switch (this.position) {
            case 0:
                this.threePictures.push(this.dataPicture[this.dataPicture.length - 1]);
                this.threePictures.push(this.dataPicture[this.position]);
                this.threePictures.push(this.dataPicture[1]);
                break;
            case this.dataPicture.length - 1:
                this.threePictures.push(this.dataPicture[this.position - 1]);
                this.threePictures.push(this.dataPicture[this.position]);
                this.threePictures.push(this.dataPicture[0]);
                break;
            default:
                this.threePictures.push(this.dataPicture[this.position - 1]);
                this.threePictures.push(this.dataPicture[this.position]);
                this.threePictures.push(this.dataPicture[this.position + 1]);
        }
        this.createImage(this.threePictures);
        return this.threePictures;
    }

    private createImage(listCard: CanvasInformation[]): void {
        const nbpicture = listCard.length;
        if (nbpicture >= 1) {
            if (this.previewImage1 !== undefined) {
                this.previewImage1.nativeElement.src = listCard[0].picture;
            }
        }
        if (nbpicture >= 2) {
            if (this.previewImage2 !== undefined) {
                this.previewImage2.nativeElement.src = listCard[1].picture;
            }
        }
        if (nbpicture >= 3) {
            if (this.previewImage3 !== undefined) {
                this.previewImage3.nativeElement.src = listCard[2].picture;
            }
        }
    }

    loadPicture(loadedPicture: CanvasInformation): void {
        if (confirm('load :' + loadedPicture.name)) {
            this.cvsResizerService.canvasSize.y = loadedPicture.height;
            this.cvsResizerService.canvasSize.x = loadedPicture.width;
            this.drawingService.convertBase64ToBaseCanvas(loadedPicture.picture);
            // undo-Redo
            const image = new Image();
            image.src = loadedPicture.picture;
            const actionLoadImg = new LoadAction(image, loadedPicture.height, loadedPicture.width, this.drawingService, this.cvsResizerService);
            this.undoRedoService.clearUndo();
            this.undoRedoService.clearRedo();
            this.undoRedoService.loadImage(actionLoadImg);
            this.automaticSaveService.loadSave(loadedPicture.picture, loadedPicture.width, loadedPicture.height);
            this.dialogRef.close(true);
            this.router.navigate(['/editor']);
        }
    }

    deletePicture(picture: CanvasInformation): void {
        if (confirm('Supprimer : ' + picture.name)) {
            const deleteMassage: Message = { title: 'delete', body: picture._id };
            this.clientServerComSvc.deleteQuery(deleteMassage).subscribe((info) => this.messageDelite(info));
        }
    }

    messageDelite(message: Message): void {
        alert(message.body);
        this.addAllData();
    }

    @HostListener('window:keydown.ArrowLeft', ['$event']) onLeftArrow(event: KeyboardEvent): void {
        this.prior();
    }

    @HostListener('window:keydown.ArrowRight', ['$event']) onRightArrow(event: KeyboardEvent): void {
        this.next();
    }
}
