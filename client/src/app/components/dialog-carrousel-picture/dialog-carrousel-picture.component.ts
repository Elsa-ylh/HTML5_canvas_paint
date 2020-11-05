// tslint:disable:no-magic-numbers
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
const NB_FILES_OPEN_AT_A_TIME = 3;
@Component({
    selector: 'app-dialog-carrousel-picture',
    templateUrl: './dialog-carrousel-picture.component.html',
    styleUrls: ['./dialog-carrousel-picture.component.scss'],
})
export class CarrouselPictureComponent implements OnInit {
    private dataPicture: CanvasInformation[] = [];
    private position: number = 0;
    dataLabel: Label[] = [];
    private labelSelect: string[] = [];
    selectedType: string = 'name';
    name: string;
    myDate: FormControl = new FormControl(new Date());

    constructor(
        private clientServerComSvc: ClientServerCommunicationService,
        private cvsResizerService: CanvasResizerService,
        private drawingService: DrawingService,
        private router: Router,
        private dialogRef: MatDialogRef<CarrouselPictureComponent>,
    ) {}

    ngOnInit(): void {
        this.addAllData();
        this.addAllLabal();
    }
    private addAllData(): void {
        this.clientServerComSvc.getData().subscribe((info) => (this.dataPicture = info));
    }

    private addAllLabal(): void {
        this.dataLabel = this.clientServerComSvc.getAllLabel();
    }

    reset(): void {
        this.addAllLabal();
        this.addAllData();
        this.labelSelect = [];
        this.name = '';
        this.myDate = new FormControl(new Date());
    }
    refresh(): void {
        this.addAllLabal();
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
    getPicturesAll(): CanvasInformation[] {
        return this.dataPicture;
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
        const threePictures: CanvasInformation[] = [];
        if (this.dataPicture.length <= NB_FILES_OPEN_AT_A_TIME) {
            this.createImage(this.dataPicture);
            return this.dataPicture;
        }

        switch (this.position) {
            case 0:
                threePictures.push(this.dataPicture[this.dataPicture.length - 1]);
                threePictures.push(this.dataPicture[this.position]);
                threePictures.push(this.dataPicture[1]);
                break;
            case this.dataPicture.length - 1:
                threePictures.push(this.dataPicture[this.position - 1]);
                threePictures.push(this.dataPicture[this.position]);
                threePictures.push(this.dataPicture[0]);
                break;
            default:
                threePictures.push(this.dataPicture[this.position - 1]);
                threePictures.push(this.dataPicture[this.position]);
                threePictures.push(this.dataPicture[this.position + 1]);
        }
        this.createImage(threePictures);
        return threePictures;
    }
    @ViewChild('previewImage0', { static: false }) previewImage0: ElementRef<HTMLImageElement>;
    @ViewChild('previewImage1', { static: false }) previewImage1: ElementRef<HTMLImageElement>;
    @ViewChild('previewImage2', { static: false }) previewImage2: ElementRef<HTMLImageElement>;
    // https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly
    /*ngAfterViewInit(): void {
        this.previewImage0.nativeElement.src = this.drawingService.convertBaseCanvasToBase64();
    }*/
    private createImage(listCard: CanvasInformation[]): void {
        this.previewImage0.nativeElement.src = this.drawingService.convertBaseCanvasToBase64();
        this.previewImage1.nativeElement.src = this.drawingService.convertBaseCanvasToBase64();
        this.previewImage2.nativeElement.src = this.drawingService.convertBaseCanvasToBase64();
    }
    loadPicture(picture: CanvasInformation): void {
        if (confirm('load :' + picture.name)) {
            this.cvsResizerService.canvasSize.y = picture.height;
            this.cvsResizerService.canvasSize.x = picture.width;
            this.drawingService.convertBase64ToBaseCanvas(picture.picture);
            this.dialogRef.close(true);
            this.router.navigate(['/editor']);
        }
    }
    deletePicture(picture: CanvasInformation): void {
        if (confirm('Suprimer : ' + picture.name)) {
            const deleteMassage: Message = { title: 'delete', body: picture._id };
            this.clientServerComSvc.deleteQuery(deleteMassage).subscribe((info) => this.messageDelite(info));
        }
    }
    messageDelite(message: Message): void {
        alert(message.body);
    }
}
