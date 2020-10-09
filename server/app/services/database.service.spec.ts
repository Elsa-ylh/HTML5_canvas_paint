import { CancasInformation } from '@common/communication/canvas-information';
import { expect } from 'chai';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';

describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let db: Db;
    let client: MongoClient;
    let testCancasInformation: CancasInformation;

    beforeEach(async () => {
        databaseService = new DatabaseService();

        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();
        client = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

        db = client.db(await mongoServer.getDbName());
        databaseService.collection = db.collection('test');
        testCancasInformation = { name: 'test1', labels: [{ label: 'label1' }], date: '2020-10-08', picture: 'test1' };
        databaseService.collection.insertOne(testCancasInformation);
    });

    it('should test collection', () => {
        expect(databaseService.collection).to.not.equal(undefined);
    });

    it('should be created', async (done: Mocha.Done) => {
        const getImageData = await databaseService.getPictures();
        console.log(getImageData);
        done();
    });
});
