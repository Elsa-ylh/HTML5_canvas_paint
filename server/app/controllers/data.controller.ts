import { DatabasePicureService } from '@app/services/data-base-picture.service';
import { CancasInformation } from '@common/communication/canvas-information';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

const HTTP_STATUS_BAD_REQUEST = 400;
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
                    const errorMessage: CancasInformation = {
                        id: 'Error',
                        name: reason as string,
                        labels: [],
                        date: new Date().toString(),
                        picture: '',
                    };
                    res.json(errorMessage);
                });
        });
        this.router.post('/labels', (req: Request, res: Response, next: NextFunction) => {
            let sbody: string;
            let labels: string[] = [];
            try {
                sbody = req.body.body;
                labels = this.textToTable(sbody);
            } catch (error) {
                const errorData: CancasInformation = {
                    id: 'Error',
                    name: error as string,
                    labels: [],
                    date: new Date().toString(),
                    picture: '',
                };
                res.status(HTTP_STATUS_BAD_REQUEST).json(errorData);
                sbody = 'Error';
            }
            if (sbody !== 'Error') {
                this.databaseService
                    .getPicturesLabals(labels)
                    .then((cancasInformation: CancasInformation[]) => {
                        res.json(cancasInformation);
                    })
                    .catch((reason: unknown) => {
                        const errorMessage: CancasInformation = {
                            id: 'Error',
                            name: reason as string,
                            labels: [],
                            date: new Date().toString(),
                            picture: '',
                        };
                        res.json(errorMessage);
                    });
            }
        });
    }
    private textToTable(theTest: string): string[] {
        return theTest.split(',');
    }
}
