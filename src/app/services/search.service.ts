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

  private getSerachType(index: number): string{
    const types = {
        1: "Channel",
        3: "Media",
        4: "Theme",
        5: "Person",
        6: "Tag",
        7: "Section",
        8: "Series",
        11: "Path"
    };
    return types[index] || null;
  }

  public getSerachTypeName(index: number): string{
    const types = {
        1: "Канал",
        3: "Ролик",
        4: "Тема",
        5: "Персона",
        6: "Тег",
        7: "Раздел",
        8: "Передача"
    };
    return types[index] || null;
  }

  search(typeId: number, sessionId: string, data: any) {
    const method = this.getSerachType(typeId);
    const url = `https://api.newstube.ru/urldev/${method}/Search`
    const params = new HttpParams()
    .set('sessionId', sessionId);

    return this.http.post<any>(url, data, {params})
    .pipe( catchError(this.handleError(url)));
  }

  searchCount(typeId: number, sessionId: string, data: any) {
      const method = this.getSerachType(typeId);
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
