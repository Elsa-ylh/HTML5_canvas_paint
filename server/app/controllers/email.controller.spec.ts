import { Application } from '@app/app';
import { EmailService } from '@app/services/email.service';
import { TYPES } from '@app/types';
import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';

export const EVERYTHING_IS_FINE = 200;
export const BAD_EMAIL = 412;
export const IMAGE_EXTENSION_NOT_SAME_AS_BINARY = 412;
export const ALL_OTHER_ERRORS = 500;

describe('Email controller', () => {
    let emailService: Stubbed<EmailService>;
    let app: Express.Application;
    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.EmailService).toConstantValue({
            isEmailValid: sandbox.stub().resolves(true),
            isContentValid: sandbox.stub().resolves(true),
            sendEmail: sandbox.stub().resolves(),
        });
        emailService = container.get(TYPES.EmailService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('should undefined', async () => {
        emailService.isEmailValid.resolves(false);
        emailService.isContentValid.resolves(false);
        return supertest(app)
            .post('/api/email')
            .expect(400)
            .then((response: any) => {
                expect(response.body).to.deep.equal("Votre requête a besoin d'un courriel.");
            });
    });

    it('should ', async () => {});
});
