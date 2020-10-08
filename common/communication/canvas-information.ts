export interface CancasInformation {
    _id: string;
    name: string;
    labels: Array<Label>;
    image: string; //base64
    date: string;
}
export interface Label {
    label: string;
}
