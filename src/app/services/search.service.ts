import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { AlertService } from './alert.service'

import {Observable, throwError, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http: HttpClient,
    private alertService: AlertService
    ) { }

  search(method: string, sessionId: string, data: any) {
    const url = `https://api.newstube.ru/urldev/${method}/Search`
    const params = new HttpParams()
    .set('sessionId', sessionId);

    return this.http.post<any>(url, data, {params})
    .pipe( catchError(this.handleError(url)));
  }

  searchCount(method: string, sessionId: string, data: any) {
      const url = `https://api.newstube.ru/urldev/${method}/SearchCount`
      const params = new HttpParams()
      .set('sessionId', sessionId);
  
      return this.http.post<any>(url, data, {params})
      .pipe( catchError(this.handleError(url)) );
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
