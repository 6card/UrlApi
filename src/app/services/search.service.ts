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

  mediaSearch(sessionId: string, data: any) {
    return this.search('Media', sessionId, data);
  }

  mediaSearchCount(sessionId: string, data: any) {
    return this.searchCount('Media', sessionId, data);
  }

  tagSearch(sessionId: string, data: any) {
    return this.search('Tag', sessionId, data);
  }

  tagSearchCount(sessionId: string, data: any) {
    return this.searchCount('Tag', sessionId, data);
  }

  channelSearch(sessionId: string, data: any) {
    return this.search('Channel', sessionId, data);
  }

  channelSearchCount(sessionId: string, data: any) {
    return this.searchCount('Channel', sessionId, data);
  }

  pathSearch(sessionId: string, data: any) {
    return this.search('Path', sessionId, data);
  }

  pathSearchCount(sessionId: string, data: any) {
    return this.searchCount('Path', sessionId, data);
  }

  personSearch(sessionId: string, data: any) {
    return this.search('Person', sessionId, data);
  }

  personSearchCount(sessionId: string, data: any) {
    return this.searchCount('Person', sessionId, data);
  }

  sectionSearch(sessionId: string, data: any) {
    return this.search('Section', sessionId, data);
  }

  sectionSearchCount(sessionId: string, data: any) {
    return this.searchCount('Section', sessionId, data);
  }

  seriesSearch(sessionId: string, data: any) {
    return this.search('Series', sessionId, data);
  }

  seriesSearchCount(sessionId: string, data: any) {
    return this.searchCount('Series', sessionId, data);
  }

  themeSearch(sessionId: string, data: any) {
    return this.search('Theme', sessionId, data);
  }

  themeSearchCount(sessionId: string, data: any) {
    return this.searchCount('Theme', sessionId, data);
  }


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
