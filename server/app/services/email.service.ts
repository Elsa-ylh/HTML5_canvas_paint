import axios, { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class EmailService {
    private readonly url: string = 'http://log2990.step.polymtl.ca/email?address_validation\n=true&quick_return=true&dry_run=false';
    private readonly xTeamKey: string = '42e98715-06d2-4f68-a853-e3fa5f7f9151';

    // https://regexr.com/3e48o
    private readonly emailRegexValidation: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    async isEmailValid(email: string): Promise<boolean> {
        if (email.match(this.emailRegexValidation)) return true;
        return false;
    }

    async isContentValid(imagePath: string): Promise<boolean> {
        return true;
    }

    async sendEmail(emailAndImage: FormData): Promise<void> {
        return new Promise(() => {
            axios({
                method: 'post',
                url: this.url,
                headers: {
                    'x-team-key': this.xTeamKey,
                    ...emailAndImage.getHeaders(),
                },
                data: emailAndImage,
            })
                .then((response: AxiosResponse) => {
                    console.log(response.data);
                })
                .catch((error: Error) => {
                    console.log(error.message);
                });
        });
    }
}
