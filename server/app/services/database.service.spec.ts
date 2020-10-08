import { TYPES } from '@app/types';
import { CancasInformation } from '@common/communication/canvas-information';
import { expect } from 'chai';
// import { Collection } from 'mongodb';
import { testingContainer } from '../../test/test-utils';
import { DatabaseService } from './database.service';

describe('Database service', () => {
    let databaseService: DatabaseService;
    const dataAll = [
        { _id: '5f7f20c815892e77ddb72a80', name: 'test1', labels: [{ label: 'label1' }], date: '2020-10-08', image: 'test1' },
        { _id: '5f7f222415892e77ddb72a85', name: 'test2', labels: [{ label: 'label1' }, { label: 'label2' }], date: '2020-10-08', image: 'test2' },
        { _id: '5f7f232715892e77ddb72a87', name: 'test3', labels: [{}], date: '2020-10-08', image: 'test3' },
        { _id: '5f7f285615892e77ddb72a88', name: 'test4', labels: [{ label: 'label2' }], date: '2020-10-08', image: 'test4' },
    ] as CancasInformation;

    beforeEach(async () => {
        const [container] = await testingContainer();
        databaseService = container.get<DatabaseService>(TYPES.DatabaseService);
        databaseService.collection = dataAll;
    });

    it('should test collection', () => {
        expect(databaseService.collection).to.not.equal(undefined);
    });
    it('should be created', (done: Mocha.Done) => {
        databaseService.getImage().then((result: CancasInformation[]) => {
            expect(result.length).to.equal(4);
            done();
        });
    });
});
