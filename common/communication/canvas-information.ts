export interface CancasInformation {
    _id: string;
    name: string;
    labels: Array<Label>;
    date: string;
    image: string; //base64
}
export interface Label {
    label: string;
}
