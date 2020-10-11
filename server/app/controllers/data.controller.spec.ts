import { Application } from '@app/app';
import { DatabasePicureService } from '@app/services/data-base-picture.service';
import { TYPES } from '@app/types';
import { CancasInformation } from '@common/communication/canvas-information';
import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
// tslint:disable:no-any
const HTTP_STATUS_OK = 200;
// const HTTP_STATUS_POST_OK = 300;
describe('Data Controller', () => {
    // const baseMessageErreur = { title: 'Error', body: '' } as Message;

    let dataService: Stubbed<DatabasePicureService>;
    let app: Express.Application;
    const testCancasInformationAdd: CancasInformation = {
        id: '',
        name: 'test5',
        labels: [{ label: 'label1' }],
        date: '2020-10-08',
        picture: 'test5',
    };
    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DatabasePicureService).toConstantValue({
            getPicturesLabals: sandbox.stub().resolves(testCancasInformationAdd),
            getPictures: sandbox.stub().resolves(testCancasInformationAdd),
        });
        dataService = container.get(TYPES.DatabasePicureService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should return ', async () => {
        dataService.getPictures.resolves(testCancasInformationAdd);
        return supertest(app)
            .get('/api/data')
            .expect(HTTP_STATUS_OK)
            .then((reponse: any) => {
                expect(reponse.body).to.deep.equal(testCancasInformationAdd);
            });
    });
    it('should return rejet ', async () => {
        dataService.getPictures.rejects(new Error('error in the service'));
        return supertest(app)
            .get('/api/data')
            .expect(HTTP_STATUS_OK)
            .then((reponse: any) => {
                expect(reponse.body.title).to.deep.equal('Error');
            });
    });
    /*it('should post test ', async () => {
        dataService.getPicturesLabals.resolves(testCancasInformationAdd);
        const service = {
            title: 'labels',
            body: 'label1',
        };

        return supertest(app)
            .post('/api/data/labels')
            .expect(HTTP_STATUS_POST_OK).
            .then(async (reponse: any) => {
                console.log(reponse);
                expect(reponse).to.deep.equal(testCancasInformationAdd);
            })
            .catch((err: Error) => {
                console.log('Error ' + err);
            });
    });*/
});
