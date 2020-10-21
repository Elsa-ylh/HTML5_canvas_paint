import { CancasInformation } from '@common/communication/canvas-information';
import { expect } from 'chai';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabasePicureService } from './data-base-picture.service';

describe('Database service', () => {
    let databaseService: DatabasePicureService;
    let mongoServer: MongoMemoryServer;
    let db: Db;
    let client: MongoClient;
    let testCancasInformationAdd: CancasInformation;
    const allDataTest = [
        { name: 'test1', labels: [{ label: 'label1' }], date: new Date('10/08/2020'), picture: 'test1' },
        { name: 'test2', labels: [{ label: 'label1' }, { label: 'label2' }], date: new Date('10/08/2020'), picture: 'test2' },
        { name: 'test3', labels: [{}], date: new Date('10/08/2020'), picture: 'test3' },
        { name: 'test4', labels: [{ label: 'label2' }], date: new Date('10/08/2020'), picture: 'test4' },
    ] as CancasInformation[];

    beforeEach(async () => {
        databaseService = new DatabasePicureService();

        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();
        client = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

        db = client.db(await mongoServer.getDbName());
        databaseService.collection = db.collection('test');
        testCancasInformationAdd = { id: '', name: 'test5', labels: [{ label: 'label1' }], date: new Date('10/08/2020'), picture: 'test5' };
        databaseService.collection.insertMany(allDataTest);
        await databaseService.getPictures();
    });

    afterEach(async () => {
        await client.close();
    });

    it('should getPictures all data', async () => {
        const getImageData = await databaseService.getPictures();
        expect(getImageData.length > 0).to.equal(true);
    });

    it('hould getPicturesLabals not label return all data ', async () => {
        const label: string[] = [];
        const getImageData = await databaseService.getPicturesLabals(label);
        expect(getImageData.length).to.equal(4);
    });

    it('should getPicturesLabals return null ', async () => {
        const label: string[] = ['a'];
        const getImageData = await databaseService.getPicturesLabals(label);
        expect(getImageData.length).to.equal(0);
    });

    it('should getPicturesLabals return 2 CancasInformation ', async () => {
        const label: string[] = ['label1'];
        const getImagesData = await databaseService.getPicturesLabals(label);
        expect(getImagesData.length).to.equal(2);
    });

    it('should getPicturesLabals 2 labels return 3 CancasInformation ', async () => {
        const label: string[] = ['label1', 'label2'];
        const getImagesData = await databaseService.getPicturesLabals(label);
        expect(getImagesData.length).to.equal(3);
    });

    it('should addPicture in the collection and find the added item', async () => {
        await databaseService.addPicture(testCancasInformationAdd);
        const getImagesData: CancasInformation = await databaseService.getPictureName(testCancasInformationAdd.name);
        expect(getImagesData.name).to.equal(testCancasInformationAdd.name);
    });

    it('should addPicture is not add collection', async () => {
        const newPictError = { name: '', labels: [{ label: 'label2' }], date: new Date('10/08/2020'), picture: 'a' } as CancasInformation;
        await databaseService
            .addPicture(newPictError)
            .then((resol: any) => {
                expect(resol).to.equal(new Error('Invalid picture'));
            })
            .catch((resol: Error) => {
                expect(resol.message).to.equal('Invalid picture');
            });
    });
    it('all many label but 3 diferant label', async () => {
        await databaseService.collection.insertOne({
            name: 'test5',
            labels: [{ label: 'label3' }],
            date: new Date('10/08/2020'),
            picture: 'test5',
        } as CancasInformation);
        await databaseService
            .getAllLabel()
            .then((resol: any) => {
                expect(resol[0].label).to.equal('label1');
                expect(resol[1].label).to.equal('label2');
                expect(resol[2].label).to.equal('label3');
            })
            .catch((resol: Error) => {
                console.log('errer test :' + resol.message);
            });
    });
    it('', async () => {
        await databaseService
            .getAllLabel()
            .then((resol: any) => {
                expect(resol[0].label).to.equal('label1');
                expect(resol[1].label).to.equal('label2');
            })
            .catch((resol: Error) => {
                console.log('errer test :' + resol.message);
            });
    });
    it('test error find getPictures', async () => {
        client.close();
        await databaseService
            .getPictures()
            .then((req: any) => {
                expect(req.name).to.equal('MongoError');
            })
            .catch((relta: Error) => {
                expect(relta.message).to.not.equal(NaN);
            });
    });

    it('test error find getPicturesLabals', async () => {
        client.close();
        const label: string[] = ['label1'];
        await databaseService
            .getPicturesLabals(label)
            .then((req: any) => {
                expect(req.name).to.equal('MongoError');
            })
            .catch((relta: Error) => {
                expect(relta.message).to.not.equal(NaN);
            });
    });
    it('find getPicturesLabals labol si error', async () => {
        const label: string[] = ['Error'];
        const getImagesData = await databaseService.getPicturesLabals(label).catch((relta: Error) => {
            expect(relta.message).to.not.equal(NaN);
        });
        expect(getImagesData[0].name).to.equal('Error');
    });
    it('test error catch getPictureName', async () => {
        client.close();
        const label: string = 'label1';
        await databaseService
            .getPictureName(label)
            .then((req: CancasInformation) => {
                expect(req.name).to.equal('MongoError');
            })
            .catch((error: Error) => {
                expect(error.name).to.equal('MongoError');
            });
    });

    it('test error find addPicture', async () => {
        client.close();
        await databaseService
            .addPicture(testCancasInformationAdd)
            .then((value: any) => {
                expect(value.name).to.equal('Error');
            })
            .catch((error: unknown) => {
                return error;
            });
    });
    it('test error find getAllLabel', async () => {
        client.close();
        await databaseService
            .getAllLabel()
            .then((value: any) => {
                expect(value.name).to.equal('Error');
            })
            .catch((error: unknown) => {
                return error;
            });
    });
});
