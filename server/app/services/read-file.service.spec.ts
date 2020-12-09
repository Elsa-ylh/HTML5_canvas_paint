import { expect } from 'chai';
import { ReadFileService } from './read-file.service';
describe('Read File service', () => {
    let readFileService: ReadFileService;
    const nomFile = 'test_read.txt';

    beforeEach(async () => {
        readFileService = new ReadFileService(nomFile);
    });

    it('should constructor ReadFileService', () => {
        const text = "test =' test1\r\ntest2 =' test2\r\ntrreawwadrweq";
        expect(readFileService['textInfo']).to.be.equal(text);
        expect(readFileService['isReal']).to.be.equal(true);
        expect(readFileService['nomeFile']).to.be.equal(nomFile);
    });

    it('should test constructor not nom file', () => {
        let newReadFileService = new ReadFileService('');
        expect(newReadFileService['isReal']).to.be.equal(false);
        expect(newReadFileService['textInfo']).to.be.equal('');
        expect(newReadFileService['nomeFile']).to.be.equal('');
    });
    it(' openFileRead return true', () => {
        expect(readFileService['openFileRead']()).to.be.equal(true);
    });
    it(' openFileRead return false', () => {
        readFileService['nomeFile'] = '';
        expect(readFileService['openFileRead']()).to.be.equal(false);
    });
    it(' getInfos isReal false , nomeFile "" and return []', () => {
        readFileService['nomeFile'] = '';
        readFileService['isReal'] = false;
        expect(readFileService['getInfos']().length).to.be.equal(0);
    });
    it(' getInfos isReal false and reussi openFileRead return 2 line info', () => {
        readFileService['isReal'] = false;
        expect(readFileService['getInfos']().length).to.be.equal(2);
    });
    it(' getInfos return 2 line info', () => {
        readFileService['isReal'] = true;
        expect(readFileService['getInfos']().length).to.be.equal(2);
    });
});
