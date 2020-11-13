import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class EmailService {
    constructor() {}

    isEmailValid(email: string): boolean {
        return true;
    }
}
