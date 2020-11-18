import { EmailService } from '@app/services/email.service';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import * as FormData from 'form-data';

export const EVERYTHING_IS_FINE = 200;
@injectable()
export class EmailController {
    router: Router;

    constructor(@inject(TYPES.EmailService) private emailService: EmailService) {
        this.configureRouter();
        /*
        const FormData = require('form-data');
        const fs = require('fs');
        const data = new FormData();
        data.append('to', email);
        data.append('payload', fs.createReadStream('D:/Desktop/yolo.png'));
        */
       this.emailService;
    }
    private configureRouter(): void {
        this.router = Router();
        this.router.post('/', async (req: Request, res: Response) => {
            // everything in async await promise

            console.log(req.body.email);
            console.log(req.files[0]);

            const fileReader = new window.FileReader();
            fileReader.readAsArrayBuffer(req.files[0]);
            fileReader.onload = (ev) => {
                const result = ev.target?.result;
                const formData = new FormData();
                formData.append('to', req.body.email);
                const fs = require('fs');
                formData.append('payload', fs.createReadStream(result));

                this.emailService.sendEmail(formData);

                res.status(EVERYTHING_IS_FINE).send("Si le courriel existe, l'image devrait se rendre au courriel dans un instant.");
            }

            // verify image is valid
            // const image = req.body.payload;

            // send out the request by Axios

            // console log the result of the sent out email

        });
    }
}
