import { ImageFormat } from '@common/communication/image-format';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import * as FileType from 'file-type';
import { FileTypeResult } from 'file-type/core';
import * as FormData from 'form-data';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class EmailService {
    private readonly url: string = 'http://log2990.step.polymtl.ca/email?address_validation\n=true&quick_return=true&dry_run=false';
    private readonly xTeamKey: string = '42e98715-06d2-4f68-a853-e3fa5f7f9151';

    // https://regexr.com/3e48o
    private readonly emailRegexValidation: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    isEmailValid(email: string): boolean {
        return email.match(this.emailRegexValidation) !== null;
    }

    async getImageExtension(imagePath: string): Promise<ImageFormat> {
        const extension = imagePath.split('.').pop();
        if (extension === 'png' || extension === 'PNG') {
            return ImageFormat.PNG;
        }
        if (extension === 'jpg' || extension === 'jpeg' || extension === 'JPG' || extension === 'JPEG') {
            return ImageFormat.JPG;
        }
        return ImageFormat.NONE;
    }

    async isContentValid(imagePath: string, expectedExtension: ImageFormat): Promise<boolean> {
        // https://www.npmjs.com/package/file-type
        let imageFormatResult: FileTypeResult;
        imageFormatResult = (await FileType.fromFile(imagePath)) as FileTypeResult;
        if (imageFormatResult.ext === 'png' && expectedExtension === ImageFormat.PNG) {
            return true;
        }
        if (imageFormatResult.ext === 'jpg' && expectedExtension === ImageFormat.JPG) {
            return true;
        }
        return false;
    }

    async sendEmail(emailAndImage: FormData): Promise<AxiosResponse> {
        return axios
            .post(this.url, emailAndImage, {
                headers: {
                    'x-team-key': this.xTeamKey,
                    ...emailAndImage.getHeaders(),
                },
            })
            .then((response: AxiosResponse) => {
                console.log(response.data);
                return response;
            })
            .catch((error: Error) => {
                console.log(error.message);
                throw error;
            });
    }
}
