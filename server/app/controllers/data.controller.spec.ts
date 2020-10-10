import { Application } from '@app/app';
import { DatabasePicureService } from '@app/services/data-base-picture.service';
import { TYPES } from '@app/types';
import { CancasInformation } from '@common/communication/canvas-information';
import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
// tslint:disable:no-any
const HTTP_STATUS_OK = 200;

describe('Data Controller', () => {
    // const baseMessageErreur = { title: 'Error', body: '' } as Message;

    let dataService: Stubbed<DatabasePicureService>;
    let app: Express.Application;
    const testCancasInformationAdd: CancasInformation = { name: 'test5', labels: [{ label: 'label1' }], date: '2020-10-08', picture: 'test5' };
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
    /* it('should post test ', async () => {
        dataService.getPicturesLabals.resolves(testCancasInformationAdd);
        return supertest(app)
            .get('/api/data/labels')
            .expect(HTTP_STATUS_OK)
            .then((reponse: any) => {
                expect(reponse.body).to.deep.equal(testCancasInformationAdd);
            });
    });*/
});
