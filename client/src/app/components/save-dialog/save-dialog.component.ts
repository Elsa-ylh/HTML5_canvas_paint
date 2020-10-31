import { Component, OnInit } from '@angular/core';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { Label } from '@common/communication/canvas-information';
const MIN_CHARACTER = 6;
const MAX_CHARACTER = 10;
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
    disabled: boolean = true;

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
        if (nameResult && labelResult) {
        }
        return false;
    }
    // retour inverser
    verifierName(name: string): boolean {
        return name === '' || name === undefined || this.notGoodCharacter(name);
    }
    verifierLabel(label: string): boolean {
        if (this.notGoodCharacter(label)) {
            return true;
        }
        if (label !== '') {
            return false;
        }
        const arrayText = label.split(' ');
        for (let index = 0; index < arrayText.length; index++) {
            const element = arrayText[index];
            if (element.length < MIN_CHARACTER || element.length > MAX_CHARACTER) return true;
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
            text.split('?').length !== 0 ||
            text.split('|').length !== 0
        );
    }
}
