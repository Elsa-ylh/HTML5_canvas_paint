export interface CanvasInformation {
    id: string;
    name: string;
    labels: Label[];
    date: Date;
    picture: string; // base64
}
export interface Label {
    label: string;
}
