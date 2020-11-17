import { EmailService } from '@app/services/email.service';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { Email } from '@common/communication/email';

export const EVERYTHING_IS_FINE = 200;
@injectable()
export class EmailController {
    router: Router;

    constructor(@inject(TYPES.EmailService) private emailService: EmailService) {
        this.configureRouter();

        const email = 'lithai357@gmail.com';

        let response = this.emailService.isEmailValid(email);
        if (response) console.log('great email');

        /*
        const FormData = require('form-data');
        const fs = require('fs');
        const data = new FormData();
        data.append('to', email);
        data.append('payload', fs.createReadStream('D:/Desktop/yolo.png'));
        */
    }
    private configureRouter(): void {
        this.router = Router();
        this.router.post('/', async (req: Request, res: Response) => {
            // everything in async await promise

            const emailBody: Email = req.body as Email;

            console.log(emailBody);

            // verify image is valid
            // const image = req.body.payload;

            // send out the request by Axios

            // console log the result of the sent out email

            res.status(EVERYTHING_IS_FINE).send("Si le courriel existe, l'image devrait se rendre au courriel dans un instant.");
        });
    }
}
