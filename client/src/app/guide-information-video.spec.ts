import { GuideInformationVideo } from './guide-information-video';

describe('GuideInformationVideo', () => {
    it('should create an instance', () => {
        expect(new GuideInformationVideo('est_le_Titre', 'est un paragephe', 'est_le_nom_video')).toBeTruthy();
    });
});
