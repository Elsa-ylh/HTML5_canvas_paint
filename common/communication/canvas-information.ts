export interface CancasInformation {
    id: string;
    name: string;
    labels: Array<Label>;
    date: string;
    picture: string; //base64
}
export interface Label {
    label: string;
}
