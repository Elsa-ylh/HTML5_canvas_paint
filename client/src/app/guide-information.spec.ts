import { GuideInformationPicture, GuideInformationVideo } from './guideinformation';

describe('Guideinformation', () => {
    it('should create an instance', () => {
        expect(new GuideInformationPicture('est_le_Titre', 'est un paragephe', 'est_le_nom_image')).toBeTruthy();
    });
});
describe('GuideInformationVideo', () => {
    it('should create an instance', () => {
        expect(new GuideInformationVideo('est_le_Titre', 'est un paragephe', 'est_le_nom_video')).toBeTruthy();
    });
});
