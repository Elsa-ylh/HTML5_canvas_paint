// Le gabari ou les informations du guide d utilisation.
// Chaque composantes doit avoir un titre une descrition et soit une image ou une video

export abstract class AbsGuideInformation {
    title: string;
    paragraphInformation: string;
    elementName: string;

    constructor(title: string, paragraphInformation: string, elementName: string) {
        this.title = title;
        this.paragraphInformation = paragraphInformation;
        this.elementName = elementName;
    }

    getTitle(): string {
        return this.title;
    }

    getParagraphInformation(): string {
        return this.paragraphInformation;
    }
}
