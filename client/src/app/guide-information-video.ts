import { AbsGuideInformation } from './classes/abs-guide-information';

export class GuideInformationVideo extends AbsGuideInformation {
    constructor(title: string, paragraphInformation: string, elementName: string) {
        super(title, paragraphInformation, elementName);
    }
}
// le tipe de video non déssidé en équipe donc vide pour lintent
