import { TYPES } from '@app/types';
import { CancasInformation } from '@common/communication/canvas-information';
import { expect } from 'chai';
import { Collection } from 'mongodb';
import { testingContainer } from '../../test/test-utils';
import { DatabaseService } from './database.service';

describe('Database service', () => {
    let databaseService: DatabaseService;
    const dataAll = {} as Collection<CancasInformation>;

    beforeEach(async () => {
        const [container] = await testingContainer();
        databaseService = container.get<DatabaseService>(TYPES.DatabaseService);
        databaseService.collection = dataAll;
    });

    it('should test collection', () => {
        expect(databaseService.collection).to.not.equal(undefined);
    });

    it('should be created', async (done: Mocha.Done) => {
        databaseService.collection = dataAll;
        const getImageData = await databaseService.getPictures();
        console.log(getImageData);
        done();
    });
});
