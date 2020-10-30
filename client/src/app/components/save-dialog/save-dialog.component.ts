import { Component, OnInit } from '@angular/core';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { Label } from '@common/communication/canvas-information';

@Component({
    selector: 'app-save-dialog',
    templateUrl: './save-dialog.component.html',
    styleUrls: ['./save-dialog.component.scss'],
})
export class SaveDialogComponent implements OnInit {
    dataLabel: Label[] = [];
    textLabel: string = '';
    private labelSelect: string[] = [];

    constructor(private clientServerCommunicationService: ClientServerCommunicationService) {}
    ngOnInit(): void {
        this.addAllLabal();
    }
    private addAllLabal(): void {
        this.dataLabel = this.clientServerCommunicationService.getAllLabel();
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
    }

    refresh(): void {
        this.addAllLabal();
    }
    saveServer(): void {}
}
