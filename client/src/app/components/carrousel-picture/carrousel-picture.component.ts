import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { CancasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';

@Component({
    selector: 'app-carrousel-picture',
    templateUrl: './carrousel-picture.component.html',
    styleUrls: ['./carrousel-picture.component.scss'],
})
export class CarrouselPictureComponent implements OnInit {
    private dataPicture: CancasInformation[] = [];
    dataLabel: Label[] = [];
    private labelSelect: string[] = [];
    selectedType: string = 'name';
    name: string;
    myDate: FormControl = new FormControl(new Date());

    constructor(private clientServerCommunicationService: ClientServerCommunicationService) {}

    ngOnInit(): void {
        this.addAllLabal();
        this.addAllData();
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
    getPicturesTestAll(): CancasInformation[] {
        return this.dataPicture;
    }
    setSearchCriteria(): void {
        switch (this.selectedType) {
            case 'name':
                const message: Message = { title: 'name', body: this.name };
                this.clientServerCommunicationService.ElementResearch(message).subscribe((info) => (this.dataPicture = info));
                break;
            case 'date':
                try {
                    const messageDate: Message = { title: 'date', body: (this.myDate.value as Date).toString() };
                    this.clientServerCommunicationService.ElementResearch(messageDate).subscribe((info) => (this.dataPicture = info));
                } catch (error) {
                    alert('La date est correttre elle doit être de forme mm/jj/aaaa');
                }
                break;
        }
    }

    /* getPicture1():void{

    };
    getPicture2():void{

    };
    getPicture3():void{

    };*/
}
