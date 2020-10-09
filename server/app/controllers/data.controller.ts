import { DatabasePicureService } from '@app/services/dataBasePicture.service';
import { CancasInformation } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class DataController {
    router: Router;

    constructor(@inject(TYPES.DatabasePicureService) private databaseService: DatabasePicureService) {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();
        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getPictures()
                .then((CancasInformation: CancasInformation[]) => {
                    res.json(CancasInformation);
                })
                .catch((reason: unknown) => {
                    const errorMessage: Message = {
                        title: 'Error',
                        body: reason as string,
                    };
                    res.json(errorMessage);
                });
        });
        this.router.post('/labels', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getPicturesLabals(req.body)
                .then((CancasInformation: CancasInformation[]) => {
                    res.json(CancasInformation);
                })
                .catch((reason: unknown) => {
                    const errorMessage: Message = {
                        title: 'Error',
                        body: reason as string,
                    };
                    res.json(errorMessage);
                });
        });
    }
}
