import { CancasInformation } from '@common/communication/canvas-information';
import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';

// CHANGE the URL for your database information

const DATABASE_URL = 'mongodb+srv://Admin:LOG2990gr103@saved-canvas-images.2ticq.mongodb.net/project2?retryWrites=true&w=majority';
const DATABASE_NAME = 'project2';
const DATABASE_COLLECTION = 'saved_canvas_pictures';

@injectable()
export class DatabasePicureService {
    collection: Collection<CancasInformation>;

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

    async getPicturesLabals(setLabels: string[]): Promise<CancasInformation[]> {
        if (setLabels[0] === 'Error') {
            return [{ id: 'not catch the labels', name: 'Error', labels: [], date: new Date().toString(), picture: '' }];
        } else if (!setLabels.length) {
            return this.getPictures();
        } else {
            return this.collection
                .find({
                    'labels.label': { $in: setLabels },
                })
                .toArray()
                .then((picture: CancasInformation[]) => {
                    return picture;
                })
                .catch((error: Error) => {
                    return [{ id: error.message as string, name: 'Error', labels: [], date: new Date().toString(), picture: '' }];
                });
        }
    }
    async getPictures(): Promise<CancasInformation[]> {
        return this.collection
            .find()
            .toArray()
            .then((pictures: CancasInformation[]) => {
                return pictures;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
    async getPictureName(namePicture: string): Promise<CancasInformation> {
        return this.collection
            .findOne({ name: namePicture })
            .then((picture: CancasInformation) => {
                return picture;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async addPicture(picture: CancasInformation): Promise<void> {
        const bool = await this.validatePicture(picture);
        if (bool === true) {
            this.collection.insertOne(picture).catch((error: Error) => {
                throw error;
            });
        } else {
            throw new Error('Invalid picture');
        }
    }
    private async validatePicture(cancas: CancasInformation): Promise<boolean> {
        const boolTestCancas = cancas.picture !== '' && cancas.name !== '';
        if (!boolTestCancas) return boolTestCancas;
        return await this.validateName(cancas.id);
    }
    private async validateName(idPicture: string): Promise<boolean> {
        const picture = await this.getPictureName(idPicture);
        return picture === null;
    }
}
