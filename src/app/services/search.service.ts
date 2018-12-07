import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { AlertService } from './alert.service'

import {Observable, throwError, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { APP_API_URLS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    @Inject(APP_API_URLS) private API_URLS,
    private http: HttpClient,
    private alertService: AlertService
    ) { }

  private getSerachType(index: number): string{
    const types = {
        1: this.API_URLS.CHANNEL_SEARCH,
        3: this.API_URLS.MEDIA_SEARCH,
        4: this.API_URLS.THEME_SEARCH,
        5: this.API_URLS.PERSON_SEARCH,
        6: this.API_URLS.TAG_SEARCH,
        7: this.API_URLS.SECTION_SEARCH,
        8: this.API_URLS.SERIES_SEARCH,
        11: this.API_URLS.PATH_SEARCH,
    };
    return types[index] || null;
  }

  private getSerachCountType(index: number): string{
    const types = {
        1: this.API_URLS.CHANNEL_SEARCH_COUNT,
        3: this.API_URLS.MEDIA_SEARCH_COUNT,
        4: this.API_URLS.THEME_SEARCH_COUNT,
        5: this.API_URLS.PERSON_SEARCH_COUNT,
        6: this.API_URLS.TAG_SEARCH_COUNT,
        7: this.API_URLS.SECTION_SEARCH_COUNT,
        8: this.API_URLS.SERIES_SEARCH_COUNT,
        11: this.API_URLS.PATH_SEARCH_COUNT,
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
    const url = `${this.API_URLS.ROOT}${method}`
    const params = new HttpParams()
    .set('sessionId', sessionId);

    return this.http.post<any>(url, data, {params})
    .pipe( catchError(this.handleError(url)));
  }

  searchCount(typeId: number, sessionId: string, data: any) {
      const method = this.getSerachCountType(typeId);
      const url = `${this.API_URLS.ROOT}${method}`
      const params = new HttpParams()
      .set('sessionId', sessionId);
  
      return this.http.post<any>(url, data, {params})
      .pipe( catchError(this.handleError(url)) );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      
      this.alertService.error(`Response ${operation} failed. ${error.message}`);

      return of(result as T);
    };
  };

}
