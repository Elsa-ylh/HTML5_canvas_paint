// tslint:disable:no-magic-numbers
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { CanvasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
const THREE_FILES_AT_A_TIME = 3;
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

    constructor(private clientServerCommunicationService: ClientServerCommunicationService) {}

    ngOnInit(): void {
        this.addAllData();
        this.addAllLabal();
    }
    private addAllData(): void {
        this.clientServerCommunicationService.getData().subscribe((info) => (this.dataPicture = info));
    }

    private addAllLabal(): void {
        this.dataLabel = this.clientServerCommunicationService.getAllLabel();
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
        console.log(this.labelSelect.length);
        this.labelSelect.length === 0 ? this.addAllData() : this.setMessageLabel(this.labelSelect);
    }
    private setMessageLabel(labels: string[]): void {
        let textLabel = '';
        for (let index = 0; index < labels.length; index++) {
            textLabel += index === labels.length - 1 ? labels[index] : labels[index] + ',';
        }
        const message: Message = { title: 'labels', body: textLabel };
        this.clientServerCommunicationService.selectPictureWithLabel(message).subscribe((info) => (this.dataPicture = info));
    }
    getPicturesAll(): CanvasInformation[] {
        return this.dataPicture;
    }
    setSearchCriteria(): void {
        switch (this.selectedType) {
            case 'name':
                const message: Message = { title: 'name', body: this.name };
                this.clientServerCommunicationService.getElementResearch(message).subscribe((info) => (this.dataPicture = info));
                break;
            case 'date':
                const messageDate: Message = { title: 'date', body: (this.myDate.value as Date).toString() };
                this.clientServerCommunicationService.getElementResearch(messageDate).subscribe((info) => (this.dataPicture = info));
                break;
        }
        this.position = 0;
    }
    prior(): void {
        switch (this.position) {
            case -1:
                this.position = -1;
                break;
            case 0:
                this.position = this.dataPicture.length - 1;
                break;
            default:
                this.position--;
                break;
        }
    }
    next(): void {
        switch (this.position) {
            case -1:
                this.position = -1;
                break;
            case this.dataPicture.length - 1:
                this.position = 0;
                break;
            default:
                this.position++;
                break;
        }
    }

    getPictures(): CanvasInformation[] {
        let threePictures: CanvasInformation[] = [];
        if (this.dataPicture.length <= THREE_FILES_AT_A_TIME) {
            threePictures = this.dataPicture;
            this.position = -1;
        }
        if (this.position > 0 && this.position <= this.dataPicture.length + 1 - THREE_FILES_AT_A_TIME) {
            for (let index = this.position - 1; index < this.position - 1 + THREE_FILES_AT_A_TIME; index++) {
                threePictures.push(this.dataPicture[index]);
            }
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
        }
        this.createImage(threePictures);
        return threePictures;
    }
    private createImage(listCard: CanvasInformation[]): void {
        listCard.forEach((element) => {
            // let canvas = document.getElementById(element.id);
            // let ctx = canvas.getContext('2d');
        });
    }
}
