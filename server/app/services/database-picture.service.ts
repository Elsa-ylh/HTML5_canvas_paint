import { CanvasInformation, Label } from '@common/communication/canvas-information';
import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import 'reflect-metadata';

const DATABASE_URL = 'mongodb+srv://Admin:LOG2990gr103@saved-canvas-images.2ticq.mongodb.net/project2?retryWrites=true&w=majority';
const DATABASE_NAME = 'project2';
const DATABASE_COLLECTION = 'saved_canvas_pictures';
const HOURS_MIDNIGHT = 23;
const MINUTE_MIDNIGHT = 59;
const SECOND_MIDNIGHT = 59;
@injectable()
export class DatabasePictureService {
    private collection: Collection<CanvasInformation>;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor() {
        MongoClient.connect(DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
            })
            .catch(() => {
                console.error('CONNECTION ERROR. EXITING PROCESS');
                process.exit(1);
            });
    }

    async getPicturesLabels(setLabels: string[]): Promise<CanvasInformation[]> {
        if (setLabels[0] === 'Error') {
            return [{ _id: 'not catch the labels', name: 'Error', labels: [], width: 0, height: 0, date: new Date(), picture: '' }];
        }
        if (!setLabels.length) {
            return this.getPictures();
        }
        return this.collection
            .find({
                'labels.label': { $in: setLabels },
            })
            .toArray()
            .then((picture: CanvasInformation[]) => {
                return picture;
            })
            .catch((error: Error) => {
                return [{ _id: error.message as string, name: 'Error', labels: [], width: 0, height: 0, date: new Date(), picture: '' }];
            });
    }

    async getPictures(): Promise<CanvasInformation[]> {
        return this.collection
            .find()
            .toArray()
            .then((pictures: CanvasInformation[]) => {
                return pictures;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
    async getAllLabels(): Promise<Label[]> {
        try {
            const listLabels: Label[] = [];
            const collectionPictures: CanvasInformation[] = await this.collection
                .find({ 'labels.label': { $exists: true } })
                .project({ 'labels.label': 1 })
                .toArray()
                .then((pictures: CanvasInformation[]) => {
                    return pictures;
                });
            collectionPictures.forEach((element) => {
                element.labels.forEach((lable) => {
                    if (this.testLabelItsNotinList(listLabels, lable)) listLabels.push(lable);
                });
            });
            return listLabels;
        } catch (error) {
            return error;
        }
    }
    private testLabelItsNotinList(listLabels: Label[], label: Label): boolean {
        let isNotInTheList = true;
        for (let index = 0; index < listLabels.length; index++) {
            if (listLabels[index].label === label.label) {
                isNotInTheList = false;
                index = listLabels.length;
            }
        }
        return isNotInTheList;
    }

    async getPictureName(namePicture: string): Promise<CanvasInformation> {
        return this.collection
            .findOne({ name: namePicture })
            .then((picture: CanvasInformation) => {
                return picture;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
    async getPicturesName(namePicture: string): Promise<CanvasInformation[]> {
        return this.collection
            .find({ name: { $regex: namePicture } })
            .toArray()
            .then((picture: CanvasInformation[]) => {
                return picture;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
    async getPicturesDate(datePicture: string): Promise<CanvasInformation[]> {
        const startDate = new Date(datePicture);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        const endDate = new Date(startDate);
        endDate.setHours(HOURS_MIDNIGHT);
        endDate.setMinutes(MINUTE_MIDNIGHT);
        endDate.setSeconds(SECOND_MIDNIGHT);
        return this.collection
            .find({ date: { $gte: startDate, $lte: endDate } })
            .toArray()
            .then((picture: CanvasInformation[]) => {
                return picture;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
    async delete(deleteId: string): Promise<boolean> {
        const response = await this.collection.deleteOne({ _id: deleteId }).catch((err) => {
            throw err;
        });
        return response.result.n === 1;
    }

    async addPicture(newpicture: CanvasInformation): Promise<boolean> {
        const newID = new ObjectId();
        const picture: CanvasInformation = {
            _id: newID.toHexString(),
            name: newpicture.name,
            labels: newpicture.labels,
            date: newpicture.date,
            picture: newpicture.picture,
            height: newpicture.height,
            width: newpicture.width,
        };
        const bool = this.validatePicture(picture);
        if (bool) {
            const resolt = await this.collection.insertOne(picture).catch((error: Error) => {
                throw error;
            });
            return resolt.result.ok === 1;
        } else {
            throw new Error('Invalid picture');
        }
    }
    async modifyPicture(canvasInfo: CanvasInformation): Promise<boolean> {
        if (this.validatePicture(canvasInfo)) {
            const res = await this.collection.updateOne({ _id: canvasInfo._id }, { $set: canvasInfo }, { upsert: true }).catch((error: Error) => {
                throw error;
            });
            return res.matchedCount === 1;
        } else {
            throw new Error('Invalid picture');
        }
    }

    private validatePicture(canvasInfo: CanvasInformation): boolean {
        const boolTestCancas = canvasInfo.picture !== '' && canvasInfo.name !== '' && canvasInfo.height >= 0 && canvasInfo.width >= 0;
        return boolTestCancas;
    }
}
