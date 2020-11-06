import { Component, OnInit } from '@angular/core';
import { CanvasResizerService } from '@app/services/canvas/canvas-resizer.service';
import { ClientServerCommunicationService } from '@app/services/client-server/client-server-communication.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
const MIN_CHARACTER = 6;
const MAX_CHARACTER = 64;
@Component({
    selector: 'app-dialog-upload',
    templateUrl: './dialog-upload.component.html',
    styleUrls: ['./dialog-upload.component.scss'],
})
export class DialogUploadComponent implements OnInit {
    dataLabel: Label[] = [];
    textLabel: string = '';
    textName: string = '';
    private labelSelect: string[] = [];
    errorTextLabel: boolean = false;
    saveload: boolean = false;

    constructor(
        private clientServerComSvc: ClientServerCommunicationService,
        private cvsResizerService: CanvasResizerService,
        private drawingService: DrawingService,
    ) {}
    ngOnInit(): void {
        this.addAllLabal();
    }
    private addAllLabal(): void {
        this.dataLabel = this.clientServerComSvc.getAllLabel();
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
    saveServer(): void {
        this.saveload = true;
        const nameResult = !this.checkName(this.textName);
        const labelResult = !this.checkLabel(this.textLabel);
        this.errorTextLabel = !nameResult;
        if (nameResult && labelResult) {
            const labelsSting: Label[] = [];
            if (this.textLabel !== '') {
                const texts = this.textLabel.split(' ');
                texts.forEach((textLabel) => {
                    labelsSting.push({ label: textLabel });
                });
            }
            this.labelSelect.forEach((element) => {
                labelsSting.push({ label: element });
            });
            const savePicture: CanvasInformation = {
                _id: '',
                date: new Date(),
                height: this.cvsResizerService.canvasSize.y,
                width: this.cvsResizerService.canvasSize.x,
                labels: labelsSting,
                name: this.textName,
                picture: this.drawingService.convertBaseCanvasToBase64(),
            };
            this.clientServerComSvc.savePicture(savePicture).subscribe((info) => this.processedMessage(info));
        } else {
            this.saveload = false;
        }
    }

    processedMessage(message: Message): void {
        if (message === undefined) {
            alert('Sauvegarde : Échec \nAucune communication au serveur');
        } else {
            alert('Sauvegarde : ' + message.title + '\n' + message.body);
        }

        this.saveload = false;
    }
    // retour inverser
    checkName(name: string): boolean {
        return name === '' || name === undefined || this.notGoodCharacter(name) || name.split(' ').length !== 1;
    }
    checkLabel(label: string): boolean {
        if (this.notGoodCharacter(label)) {
            return true;
        }
        if (label.length === 0) {
            return false;
        }
        const arrayText = label.split(' ');

        for (const textLabel of arrayText) {
            if (textLabel.length < MIN_CHARACTER || textLabel.length > MAX_CHARACTER) {
                return true;
            }
        }
        return false;
    }

    notGoodCharacter(text: string): boolean {
        return (
            text.split('#').length !== 1 ||
            text.split("'").length !== 1 ||
            text.split('/').length !== 1 ||
            text.split('"').length !== 1 ||
            text.split('-').length !== 1 ||
            text.split('&').length !== 1 ||
            text.split('*').length !== 1 ||
            text.split('!').length !== 1 ||
            text.split('$').length !== 1 ||
            text.split('?').length !== 1 ||
            text.split('|').length !== 1 ||
            text.split('%').length !== 1
        );
    }
}
