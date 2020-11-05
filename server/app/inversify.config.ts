import { DataController } from '@app/controllers/data.controller';
import { DatabasePictureService } from '@app/services/database-picture.service';
import { Container } from 'inversify';
import { Application } from './app';
import { Server } from './server';
import { TYPES } from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);

    container.bind(TYPES.DataController).to(DataController);
    container.bind(TYPES.DatabasePictureService).to(DatabasePictureService);

    return container;
};
