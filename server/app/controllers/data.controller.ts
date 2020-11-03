import { DatabasePicureService } from '@app/services/data-base-picture.service';
import { CancasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
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
                        date: new Date(),
                        picture: '',
                    };
                    res.json(errorMessage);
                });
        });
        this.router.get('/all_labels', (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getAllLabel()
                .then((labelsInformation: Label[]) => {
                    const informationMessage: CancasInformation = {
                        id: 'list_of_all_labals',
                        name: 'labels',
                        labels: labelsInformation,
                        date: new Date(),
                        picture: '',
                    };
                    res.json(informationMessage);
                })
                .catch((reason: unknown) => {
                    const errorMessage: CancasInformation = {
                        id: 'Error',
                        name: reason as string,
                        labels: [],
                        date: new Date(),
                        picture: '',
                    };
                    res.json(errorMessage);
                });
        });
        this.router.post('/labels', (req: Request, res: Response, next: NextFunction) => {
            let sbody: string;
            let labels: string[] = [];
            if (req.body.title === 'labels') {
                try {
                    sbody = req.body.body;
                    labels = this.textToTable(sbody);
                } catch (error) {
                    const errorData: CancasInformation = {
                        id: 'Error',
                        name: error as string,
                        labels: [],
                        date: new Date(),
                        picture: '',
                    };
                    res.status(HTTP_STATUS_BAD_REQUEST).json(errorData);
                    sbody = 'Error';
                }
            } else {
                const errorData: CancasInformation = {
                    id: 'Error',
                    name: 'Titre message non valide',
                    labels: [],
                    date: new Date(),
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
                            date: new Date(),
                            picture: '',
                        };
                        res.json(errorMessage);
                    });
            }
        });
        this.router.post('/research', (req: Request, res: Response, next: NextFunction) => {
            let research: string;

            if (req.body.title !== undefined) {
                research = req.body.body;
                switch (req.body.title) {
                    case 'name':
                        this.databaseService
                            .getPicturesName(research)
                            .then((cancasInformation: CancasInformation[]) => {
                                res.json(cancasInformation);
                            })
                            .catch((reason: unknown) => {
                                const errorMessage: CancasInformation = {
                                    id: 'Error',
                                    name: reason as string,
                                    labels: [],
                                    date: new Date(),
                                    picture: '',
                                };
                                res.json(errorMessage);
                            });
                        break;
                    case 'date':
                        this.databaseService
                            .getPicturesDate(research)
                            .then((cancasInformation: CancasInformation[]) => {
                                res.json(cancasInformation);
                            })
                            .catch((reason: unknown) => {
                                const errorMessage: CancasInformation = {
                                    id: 'Error',
                                    name: reason as string,
                                    labels: [],
                                    date: new Date(),
                                    picture: '',
                                };
                                res.json(errorMessage);
                            });
                        break;
                    default:
                        const errorData: CancasInformation = {
                            id: 'Error',
                            name: 'not good research : ' + req.body.title,
                            labels: [],
                            date: new Date(),
                            picture: '',
                        };
                        res.status(HTTP_STATUS_BAD_REQUEST).json(errorData);
                        break;
                }
            } else {
                const errorData: CancasInformation = {
                    id: 'Error',
                    name: 'not request in post',
                    labels: [],
                    date: new Date(),
                    picture: '',
                };
                res.status(HTTP_STATUS_BAD_REQUEST).json(errorData);
            }
        });
        this.router.delete('/delete', (req: Request, res: Response, next: NextFunction) => {
            if (req.body.title === 'delete') {
                this.databaseService
                    .delete(req.body.body)
                    .then((bool: boolean) => {
                        const succesMessage: Message = {
                            title: bool ? 'Susse' : 'Not delete',
                            body: bool ? 'Susse' : 'not good id',
                        };
                        res.json(succesMessage);
                    })
                    .catch((err: Error) => {
                        const errorMessage: Message = {
                            title: 'Errer',
                            body: err.message.toString(),
                        };
                        res.status(HTTP_STATUS_BAD_REQUEST).json(errorMessage);
                    });
            }
        });
    }
    private textToTable(theTest: string): string[] {
        return theTest.split(',');
    }
}
