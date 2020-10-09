import { CancasInformation } from '@common/communication/canvas-information';
import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';
// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://Admin:LOG2990gr103@saved-canvas-images.2ticq.mongodb.net/project2?retryWrites=true&w=majority';
const DATABASE_NAME = 'project2';
const DATABASE_COLLECTION = 'saved_canvas_pictures';
@injectable()
export class DatabaseService {
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
        console.log(this.collection);
    }
    async getPictureLabals(setLabels: string[]): Promise<CancasInformation[]> {
        if (!setLabels.length) {
            return this.getPictures();
        } else {
            return this.collection
                .find({
                    'labels.label': { $in: setLabels },
                }) /* { labels.label: { $in: Labels } } doit ajouté les condition en 'ou'logique pour le filtrage des étiquette */
                .toArray()
                .then((picture: CancasInformation[]) => {
                    return picture;
                })
                .catch((error: Error) => {
                    throw error;
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
    async getPicture(namePicture: string): Promise<CancasInformation> {
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
        if (this.validatePicture(picture)) {
            this.collection.insertOne(picture).catch((error: Error) => {
                throw error;
            });
        } else {
            throw new Error('Invalid picture');
        }
    }
    private async validatePicture(Cancas: CancasInformation): Promise<boolean> {
        return (await this.validateName(Cancas.name)) || Cancas.picture !== '';
    }
    private async validateName(namePicture: string): Promise<boolean> {
        const picture = await this.getPicture(namePicture);
        return !(namePicture === picture.name);
    }
}
