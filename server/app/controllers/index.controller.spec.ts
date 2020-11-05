import { TYPES } from '@app/types';
import { Message } from '@common/communication/message';
import { testingContainer } from '../../test/test-utils';
// tslint:disable:no-any

describe('IndexController', () => {
    const baseMessage = { title: 'Hello world', body: 'anything really' } as Message;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.IndexService).toConstantValue({
            helloWorld: sandbox.stub().resolves(baseMessage),
            about: sandbox.stub().resolves(baseMessage),
            storeMessage: sandbox.stub().resolves(),
            getAllMessages: sandbox.stub().resolves([baseMessage, baseMessage]),
        });
    });
});
