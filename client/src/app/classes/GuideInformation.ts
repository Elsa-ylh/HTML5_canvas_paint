import { AbsGuideInformation } from './AbsGuideInformation';

export class GuideInformationPicture extends AbsGuideInformation {
    constructor(title: string, paragraphInformation: string, elementName: string) {
        super(title, paragraphInformation, elementName);
    }
    //le lieu où entreposer les image non définit par léquipe dont fonction pasique
    picturePath(path: string): string {
        return path + this.elementName;
    }
}

export class GuideInformationVideo extends AbsGuideInformation {
    constructor(title: string, paragraphInformation: string, elementName: string) {
        super(title, paragraphInformation, elementName);
    }
    //le tipe de video non déssidé en équipe donc vide pour lintent
}
