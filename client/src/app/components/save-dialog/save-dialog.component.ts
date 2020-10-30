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
    textName: string = '';
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
    saveServer(): boolean {
        const nameResult = !this.verifierName(this.textName);
        const labelResult = !this.verifierLabel(this.textLabel);
        return nameResult && labelResult;
    }
    // retour inverser
    verifierName(name: string): boolean {
        return name == '' || name == undefined || this.notGoodCharacter(name);
    }
    verifierLabel(label: string): boolean {
        if (this.notGoodCharacter(label)) {
            return true;
        }
        if (label != '') {
            return false;
        }
        const arrayText = label.split(' ');
        for (let index = 0; index < arrayText.length; index++) {
            const element = arrayText[index];
            if (element.length < 6 || element.length > 20) return true;
        }
        return false;
    }
    notGoodCharacter(text: string): boolean {
        return (
            text.split('#').length !== 0 ||
            text.split("'").length !== 0 ||
            text.split('/').length !== 0 ||
            text.split('"').length !== 0 ||
            text.split('-').length !== 0 ||
            text.split('&').length !== 0 ||
            text.split('*').length !== 0 ||
            text.split('!').length !== 0 ||
            text.split('$').length !== 0 ||
            text.split('?').length !== 0
        );
    }
}
