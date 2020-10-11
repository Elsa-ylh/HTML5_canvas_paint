import { DatabasePicureService } from '@app/services/data-base-picture.service';
import { CancasInformation } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
// const HTTP_STATUS_BAD_REQUEST = 400;
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
                .then((cancasInformation: CancasInformation[]) => {
                    res.json(cancasInformation);
                })
                .catch((reason: unknown) => {
                    const errorMessage: Message = {
                        title: 'Error',
                        body: reason as string,
                    };
                    res.json(errorMessage);
                });
        });
        /* this.router.post('/labels', (req: Request, res: Response, next: NextFunction) => {
            console.log(req.body.body);
            let sbody: string;
            try {
                sbody = req.body;
            } catch (error) {
                const errorMessage: Message = {
                    title: 'Error',
                    body: error as string,
                };
                res.status(HTTP_STATUS_BAD_REQUEST).send(errorMessage);
                sbody = 'Error';
            }
            if (sbody !== 'Error') {
                const labels = this.textToTable(sbody);
                this.databaseService
                    .getPicturesLabals(labels)
                    .then((cancasInformation: CancasInformation[]) => {
                        res.json(cancasInformation);
                    })
                    .catch((reason: unknown) => {
                        const errorMessage: Message = {
                            title: 'Error',
                            body: reason as string,
                        };
                        res.json(errorMessage);
                    });
            }
        });*/
    }
    /*private textToTable(theTest: string): string[] {
        return theTest.split('#');
    }*/
}
