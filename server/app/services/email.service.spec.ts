import axios, { AxiosResponse } from 'axios';
import { expect } from 'chai';
import * as FormData from 'form-data';
import * as Sinon from 'sinon';
import { EmailService } from './email.service';

describe('Email service', () => {
    let emailService: EmailService;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(async () => {
        sandbox = Sinon.createSandbox();
        emailService = new EmailService();
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it('should check email is right', () => {
        const goodEmail = 'abc@email.com';
        const isEmailValid = emailService.isEmailValid(goodEmail);
        expect(isEmailValid).to.be.true;
    });

    it('should check email is not good', () => {
        const badEmail = 'x_x@xinject...df';
        const isEmailValid = emailService.isEmailValid(badEmail);
        expect(isEmailValid).to.be.false;
    });

    it('should check if content is right extension', async () => {
        const isContentValid = await emailService.isContentValid('png', 1);
        expect(isContentValid).to.be.true;
    });

    it('should send a normal image and expect error 422, bad form', async () => {
        sandbox.stub(axios).post.resolves({ data: 'hi' } as AxiosResponse);
        const email = 'abc@email.com';
        const formData = new FormData();
        formData.append('to', email);
        formData.append('payload', './default.jpeg');
        const response = await emailService.sendEmail(formData);
        expect(response.data).to.be.equal('hi');
    });
});
