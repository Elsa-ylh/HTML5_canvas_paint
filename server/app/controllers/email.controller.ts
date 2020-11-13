import { EmailService } from '@app/services/email.service';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
@injectable()
export class EmailController {
    // hardcoded description of the key
    private readonly x_team_key = '42e98715-06d2-4f68-a853-e3fa5f7f9151';

    router: Router;

    constructor(@inject(TYPES.EmailService) private emailService: EmailService) {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();
        this.router.post('/email', (req: Request, res: Response) => {
            const params = req.params;
            const body = req.body;
        });
        this.emailService.isEmailValid('eawd@gmail.com');
    }
}
