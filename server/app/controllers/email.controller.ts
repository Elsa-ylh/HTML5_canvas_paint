import { EmailService } from '@app/services/email.service';
import { Request, Response, Router } from 'express';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

export const EVERYTHING_IS_FINE = 200;
export const BAD_EMAIL = 412;
export const IMAGE_EXTENSION_NOT_SAME_AS_BINARY = 412;
export const ALL_OTHER_ERRORS = 500;
@injectable()
export class EmailController {
    router: Router;

    constructor(@inject(TYPES.EmailService) private emailService: EmailService) {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();
        this.router.post('/', async (req: Request, res: Response) => {
            const email = req.body.email;
            const expressImageName = req.files[0].path;
            const properImageName = req.files[0].originalname;

            const isEmailValid = await this.emailService.isEmailValid(email);
            if (!isEmailValid) {
                console.log("Le courriel fourni n'est pas d'un format valide. Le courriel doit être style abc@email.com");
                res.status(BAD_EMAIL).send("Le courriel fourni n'est pas d'un format valide. Le courriel doit être style abc@email.com");
            }
            const isImageContentEqualExtension = await this.emailService.isContentValid(expressImageName);
            if (!isImageContentEqualExtension) {
                console.log("L'extension du fichier n'est pas le même que le contenu.");
                res.status(IMAGE_EXTENSION_NOT_SAME_AS_BINARY).send("L'extension du fichier n'est pas le même que le contenu.");
            }
            fs.rename(expressImageName, properImageName, (err) => {
                if (err) {
                    console.log(err);
                    res.status(ALL_OTHER_ERRORS).send('Edge cases reached, do not attempt it again.');
                } else {
                    const formData = new FormData();
                    formData.append('to', email);
                    formData.append('payload', fs.createReadStream(properImageName));

                    this.emailService.sendEmail(formData);

                    res.status(EVERYTHING_IS_FINE).send("Si le courriel existe, l'image devrait se rendre au courriel dans un instant.");
                }
            });
        });
    }
}
