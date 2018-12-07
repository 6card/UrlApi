import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, Subject, ReplaySubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Meta, MetaColumn } from '../models/meta.model';

import { AlertService } from './alert.service';

import { APP_API_URLS } from '../config/config';

@Injectable({
    providedIn: 'root'
})

export class MetaService {

    public _meta = new Subject();
    public lastMeta = null;

    constructor(
        @Inject(APP_API_URLS) private API_URLS,
        private http: HttpClient,
        private alertService: AlertService
    ) { }

    get meta(): Observable<any> {
        return this._meta.asObservable();
    }

    loadMeta(typeId: number) {
        this.lastMeta = null;
        this.getMeta(typeId)
        .subscribe(
            (data: Meta) => {
                if (data !== null) {
                    this._meta.next(data);
                    this.lastMeta = data;
                }
            },
            error => {}
        );
    }

    getMeta(typeId: number) {
        const url = `${this.API_URLS.ROOT}${this.API_URLS.META_GET_META}`;
        const params = new HttpParams().set('typeId', String(typeId));
        return this.http.get(url, {params})
        .pipe( catchError(this.handleError(url)) );
    }


    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          this.alertService.error(`Response ${operation} failed. ${error.message}`);
          return of(result as T);
        };
    }
}
