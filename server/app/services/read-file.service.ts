import * as fs from 'fs';
import { injectable } from 'inversify';
import * as path from 'path';

@injectable()
export class ReadFileService {
    private nomeFile: string;
    private isReal: boolean = false;
    private textInfo: string;
    constructor(nomFile: string) {
        this.textInfo = '';
        this.nomeFile = nomFile;
        this.isReal = this.openFileRead();
    }
    private openFileRead(): boolean {
        try {
            const pathLocal = path.join(__dirname, '../secret/' + this.nomeFile);
            this.textInfo = fs.readFileSync(pathLocal, 'utf-8');
            if (this.textInfo !== '') return true;
        } catch (error) {
            console.log('Error Open Read file :', error);
            return false;
        }
        return false;
    }
    getInfo(): string[][] {
        if (!this.isReal) {
            this.isReal = this.openFileRead();
        }
        const textTableau: string[][] = [];
        if (this.isReal) {
            const textLine = this.textInfo.split('\r\n');
            textLine.forEach((element) => {
                textTableau.push(element.split(" ='"));
            });
        }
        return textTableau;
    }
}
