import { Message } from '@common/communication/message';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class IndexService {
    constructor() {}

    about(): Message {
        return {
            title: 'Basic Server About Page',
            body: 'Try calling helloWorld to get the time',
        };
    }
}
