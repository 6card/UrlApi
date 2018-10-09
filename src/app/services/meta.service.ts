import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Meta, MetaColumn } from '../models/meta.model';

import { AlertService } from './alert.service'

@Injectable({
    providedIn: 'root'
})

export class MetaService {

    public _meta = new Subject<any>();

    constructor(
        private http: HttpClient,
        private alertService: AlertService
    ) { }

    get meta(): Observable<any> {        
        return this._meta.asObservable();
    }

    loadMeta(typeId: number){
        const url = `https://api.newstube.ru/urldev/Meta/GetMeta`
        const params = new HttpParams().set('typeId', String(typeId));    
        this.http.get(url, {params})
        .pipe( catchError(this.handleError(url)))
        .subscribe(            
            (data: Meta) => {                
                this._meta.next(new Meta(data));
                //this.setValueValidators();
            },
            error => {}
        );
    }


    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
    
          // TODO: send the error to remote logging infrastructure
          //console.error(error); // log to console instead
      
          // TODO: better job of transforming error for user consumption
          this.alertService.error(`Response ${operation} failed. ${error.message}`);
      
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
    };
}
