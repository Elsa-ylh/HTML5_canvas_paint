import { TYPES } from '@app/types';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { IndexService } from '../services/index.service';

@injectable()
export class IndexController {
    router: Router;

    constructor(@inject(TYPES.IndexService) private indexService: IndexService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/about', (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            res.json(this.indexService.about());
        });
    }
}
