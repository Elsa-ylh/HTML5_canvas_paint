import { EmailService } from '@app/services/email.service';
import { Request, Response, Router } from 'express';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

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

            const newlyUploadImagePath = req.files[0].path;
            console.log(newlyUploadImagePath);

            fs.rename(newlyUploadImagePath, newlyUploadImagePath + '.png', (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Successfully renamed the directory.');

                    const formData = new FormData();
                    formData.append('to', 'lithai357@gmail.com');
                    formData.append('payload', fs.createReadStream(newlyUploadImagePath + '.png'));

                    this.emailService.sendEmail(formData);

                    res.status(EVERYTHING_IS_FINE).send("Si le courriel existe, l'image devrait se rendre au courriel dans un instant.");
                }
            });
        });
    }
}
