import { TYPES } from '@app/types';
import { expect } from 'chai';
import { testingContainer } from '../../test/test-utils';
import { IndexService } from './index.service';

describe('Index service', () => {
    let indexService: IndexService;

    beforeEach(async () => {
        const [container] = await testingContainer();
        indexService = container.get<IndexService>(TYPES.IndexService);
    });

    it('should return a simple message if #about is called', () => {
        const expectedTitle = 'Basic Server About Page';
        const expectedBody = 'Try calling helloWorld to get the time';
        const aboutMessage = indexService.about();
        expect(aboutMessage.title).to.equals(expectedTitle);
        expect(aboutMessage.body).to.equals(expectedBody);
    });
});
