export abstract class AbsGuideInformation {
    //le gabari où les informations du guide d'utilisation. Chaque conpossent doit avoir un titre, une descrition et soit un image ou une video
    title: string;
    paragraphInformation: string;
    elementName: string;

    constructor(title: string, paragraphInformation: string, elementName: string) {
        this.title = title;
        this.paragraphInformation = paragraphInformation;
        this.elementName = elementName;
    }

    public get getTitle(): string {
        return this.title;
    }
    public get getParagraphInformation(): string {
        return this.paragraphInformation;
    }

    //todo ajout le squelette abs pour asselte chercher un image ou video sur les class qui vont érité de AbsGuideInformation
}
