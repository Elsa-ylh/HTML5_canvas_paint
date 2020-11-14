import { EmailService } from '@app/services/email.service';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

export const EVERYTHING_IS_FINE = 200;
@injectable()
export class EmailController {
    router: Router;

    constructor(@inject(TYPES.EmailService) private emailService: EmailService) {
        this.configureRouter();
        const FormData = require('form-data');
        const fs = require('fs');
        const data = new FormData();
        data.append('to', 'lithai357@gmail.com');
        data.append('payload', fs.createReadStream('D:\\Downloads\\hellokl.jpg'));

        this.emailService.sendEmail(data);
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
