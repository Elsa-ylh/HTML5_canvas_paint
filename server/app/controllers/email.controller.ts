import { EmailService } from '@app/services/email.service';
import axios, { AxiosResponse } from 'axios';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

export const EVERYTHING_IS_FINE = 200;
@injectable()
export class EmailController {
    router: Router;

    constructor(@inject(TYPES.EmailService) private emailService: EmailService) {
        this.configureRouter();

        var FormData = require('form-data');
        var fs = require('fs');
        var data = new FormData();
        data.append('to', 'lithai357@gmail.com');
        data.append('payload', fs.createReadStream('D:/Desktop/yolo.png'));

        axios({
            method: 'post',
            url: 'http://log2990.step.polymtl.ca/email?address_validation\n=true&quick_return=true&dry_run=false',
            headers: {
                'x-team-key': '42e98715-06d2-4f68-a853-e3fa5f7f9151',
                ...data.getHeaders(),
            },
            data: data,
        })
            .then((response: AxiosResponse) => {
                console.log(response);
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }
    private configureRouter(): void {
        this.router = Router();
        this.router.post('/email', async (req: Request, res: Response) => {
            // everything in async await promise

            // verify email is valid
            const email = req.body.to;
            let isEmailValid = await this.emailService.isEmailValid(email);
            if (!isEmailValid) {
                console.error('The email sent to the backend, is invalid, please try again.');
                return;
            }

            // verify image is valid
            // const image = req.body.payload;

            // send out the request by Axios

            // console log the result of the sent out email

            res.status(EVERYTHING_IS_FINE).send("Si le courriel existe, l'image devrait se rendre au courriel dans un instant.");
        });
    }
}
