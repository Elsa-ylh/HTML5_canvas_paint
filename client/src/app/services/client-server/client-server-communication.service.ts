import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CancasInformation, Label } from '@common/communication/canvas-information';
import { Message } from '@common/communication/message';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root',
})
export class ClientServerCommunicationService {
    private readonly HTTP_SERVE_LOCAL: string = 'http://localhost:3000/api/data';
    private information: CancasInformation;
    private informations: CancasInformation[];
    constructor(private http: HttpClient) {}

    getData(): Observable<CancasInformation[]> {
        return this.http.get<CancasInformation[]>(this.HTTP_SERVE_LOCAL).pipe(catchError(this.handleError<CancasInformation[]>('basicGet')));
    }
    private getDatas(): void {
        this.getData().subscribe((info) => (this.informations = info));
    }
    resetDatas(): void {
        this.getDatas();
        this.catchInformation();
    }
    getInformation(): CancasInformation[] {
        return this.informations;
    }
    selectPictureWithLabel(message: Message): Observable<CancasInformation[]> {
        return this.http
            .post<CancasInformation[]>(this.HTTP_SERVE_LOCAL + '/labels', message)
            .pipe(catchError(this.handleError<CancasInformation[]>('basicPost')));
    }
    private selectPicturesWithLabel(message: Message): void {
        this.selectPictureWithLabel(message).subscribe((info) => (this.informations = info));
    }
    getPicturesWithLabel(message: Message): CancasInformation[] {
        this.selectPicturesWithLabel(message);
        return this.informations;
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }

    allLabel(): Observable<CancasInformation> {
        return this.http
            .get<CancasInformation>(this.HTTP_SERVE_LOCAL + '/all_labels')
            .pipe(catchError(this.handleError<CancasInformation>('basicGet')));
    }

    private catchInformation(): void {
        this.allLabel().subscribe((info) => (this.information = info));
    }

    getAllLabel(): Label[] {
        this.catchInformation();
        if (this.information == undefined) return [];
        if (this.information.id === 'list_of_all_labals') {
            return this.information.labels;
        }
        return [];
    }
    research(message: Message): void {
        this.getElementResearch(message).subscribe((info) => (this.informations = info));
    }

    getElementResearch(message: Message): Observable<CancasInformation[]> {
        return this.http
            .post<CancasInformation[]>(this.HTTP_SERVE_LOCAL + '/research', message)
            .pipe(catchError(this.handleError<CancasInformation[]>('basicPost')));
    }
}
