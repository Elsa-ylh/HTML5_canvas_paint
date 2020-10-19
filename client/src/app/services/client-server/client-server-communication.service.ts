import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CancasInformation } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root',
})
export class ClientServerCommunicationService {
    private readonly HTTP_SERVE_LOCAL: string = 'http://localhost:3000/api/data';

    constructor(private http: HttpClient) {}

    getData(): Observable<CancasInformation[]> {
        console.log('get si go');
        return this.http.get<CancasInformation[]>(this.HTTP_SERVE_LOCAL).pipe(catchError(this.handleError<CancasInformation[]>('basicGet')));
    }

    selectPictureWithLabel(message: Message): Observable<CancasInformation[]> {
        return this.http
            .post<CancasInformation[]>(this.HTTP_SERVE_LOCAL + '/labels', message)
            .pipe(catchError(this.handleError<CancasInformation[]>('basicPost')));
    }
    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
