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
            let pathLocal = path.join(__dirname, '../secret/' + this.nomeFile);
            this.textInfo = fs.readFileSync(pathLocal, 'utf-8');
            console.log(this.textInfo);
            if (this.textInfo !== '') return true;
        } catch (error) {
            console.log('Error Read file', error);
            return false;
        }

        return false;
    }
    getInfo() {
        if (!this.isReal && this.textInfo === '') {
            this.isReal = this.openFileRead();
        }
    }
}
