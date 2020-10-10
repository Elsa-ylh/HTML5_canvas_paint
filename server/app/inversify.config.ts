import { DataController } from '@app/controllers/data.controller';
import { DateController } from '@app/controllers/date.controller';
import { IndexController } from '@app/controllers/index.controller';
import { DatabasePicureService } from '@app/services/data-base-picture.service';
import { DateService } from '@app/services/date.service';
import { IndexService } from '@app/services/index.service';
import { Container } from 'inversify';
import { Application } from './app';
import { Server } from './server';
import { TYPES } from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);
    container.bind(TYPES.IndexController).to(IndexController);
    container.bind(TYPES.IndexService).to(IndexService);

    container.bind(TYPES.DateController).to(DateController);
    container.bind(TYPES.DateService).to(DateService);
    container.bind(TYPES.DataController).to(DataController);
    container.bind(TYPES.DatabasePicureService).to(DatabasePicureService);
    return container;
};
