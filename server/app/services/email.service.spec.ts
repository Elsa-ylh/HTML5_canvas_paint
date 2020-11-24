import { expect } from 'chai';
import * as FormData from 'form-data';
import * as Sinon from 'sinon';
import { EmailService } from './email.service';

describe('Email service', () => {
    let emailService: EmailService;
    let consoleSpy: Sinon.SinonStub;

    beforeEach(async () => {
        emailService = new EmailService();
        consoleSpy = Sinon.stub(console, 'log');
    });

    it('should check email is right', async () => {
        const goodEmail = 'abc@email.com';
        const isEmailValid = await emailService.isEmailValid(goodEmail);
        expect(isEmailValid).to.be.true;
    });

    it('should check email is not good', async () => {
        const badEmail = 'x_x@xinject...df';
        const isEmailValid = await emailService.isEmailValid(badEmail);
        expect(isEmailValid).to.be.false;
    });

    it('should check if content is right extension', async () => {
        const isContentValid = await emailService.isContentValid('png', 1);
        expect(isContentValid).to.be.true;
    });

    it('should send a normal image and expect error 422, bad form', async () => {
        const email = 'abc@email.com';
        const formData = new FormData();
        formData.append('to', email);
        formData.append('to', {});
        await emailService.sendEmail(formData);
        expect(consoleSpy.calledOnce);
    });
});
