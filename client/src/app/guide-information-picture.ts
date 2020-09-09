import { AbsGuideInformation } from './classes/abs-guide-information';

export class GuideInformationPicture extends AbsGuideInformation {
    constructor(title: string, paragraphInformation: string, elementName: string) {
        super(title, paragraphInformation, elementName);
    }
    // le lieu où entreposer les image non définit par léquipe dont fonction pasique
    picturePath(path: string): string {
        return path + this.elementName;
    }
}
