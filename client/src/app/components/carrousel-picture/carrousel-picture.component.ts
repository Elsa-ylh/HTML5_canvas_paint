// import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component } from '@angular/core';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { CancasInformation, Label } from '@common/communication/canvas-information';

@Component({
    selector: 'app-carrousel-picture',
    templateUrl: './carrousel-picture.component.html',
    styleUrls: ['./carrousel-picture.component.scss'],
})
export class CarrouselPictureComponent {
    private dataPicture: CancasInformation[];
    dataLabel: Label[];
    // message: Message;
    constructor(private clientServerCommunicationService: ClientServerCommunicationService) {
        this.addAllData();
        this.addAllLabal();
    }

    private addAllData(): void {
        this.clientServerCommunicationService.getData().subscribe((info) => (this.dataPicture = info));
    }

    private addAllLabal(): void {
        this.dataLabel = this.clientServerCommunicationService.getAllLabel();
    }

    raffrachire(): void {
        this.addAllLabal();
        this.addAllData();
    }

    getPicturesTestAll(): CancasInformation[] {
        return this.dataPicture;
    }

    /*getPicture1():void{

    };
    getPicture2():void{

    };
    getPicture3():void{

    };*/
}
