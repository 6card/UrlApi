import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import {Observable, throwError, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

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


  search(url: string, sessionId: string, data: any) {
    const params = new HttpParams()
    .set('sessionId', sessionId);

    return this.http.post<any>(`https://api.newstube.ru/urldev/${url}/Search`, data, {params})
    .pipe(
      catchError(this.handleError)
    );
  }

  searchCount(url: string, sessionId: string, data: any) {
      const params = new HttpParams()
      .set('sessionId', sessionId);
  
      return this.http.post<any>(`https://api.newstube.ru/urldev/${url}/SearchCount`, data, {params})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      //this.log(`${operation} failed: ${error.message}`);
    }
    // return an observable with a user-facing error message
    
    return throwError(
      'Something bad happened; please try again later.');
    //return of(error);
  };

}
