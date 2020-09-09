import { GuideInformationPicture } from './guide-information-picture';

describe('Guideinformation', () => {
    it('should create an instance', () => {
        expect(new GuideInformationPicture('est_le_Titre', 'est un paragephe', 'est_le_nom_image')).toBeTruthy();
    });
});
