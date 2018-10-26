import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { AlertService } from './alert.service'

import { ObjectBase } from '../models/object-base';

import {Observable, of, throwError} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PathService {

  constructor(
    private http: HttpClient,
    private alertService: AlertService
    ) { }

  getByUrl(sessionId: string, str: string) {
    const url = `https://api.newstube.ru/urldev/Path/GetByUrl`;
    const params = new HttpParams()
    .set('sessionId', sessionId)
    .set('url', str);
    return this.http.get(url, {params})
      .pipe( catchError(this.handleError(url)));
  }

  getByPathIdDetail(sessionId: string, id: any) {
    const url = `https://api.newstube.ru/urldev/Path/GetByPathIdDetail`;
    const params = new HttpParams()
    .set('sessionId', sessionId)
    .set('id', id);
    return this.http.get(url, {params})
      .pipe( catchError(this.handleError(url)));
  }

  getByObjectDetail(sessionId: string, typeId: any, objectId: any) {
    const url = `https://api.newstube.ru/urldev/Path/GetByObjectDetail`;
    const params = new HttpParams()
    .set('sessionId', sessionId)
    .set('objectId', objectId)
    .set('typeId', typeId);
    return this.http.get<ObjectBase>(url, {params})
      .pipe( catchError(this.handleError(url)));
  }

  updatePath(sessionId: string, data: any) {
    const url = `https://api.newstube.ru/urldev/Path/Update`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
      return this.http.post<any>(url, data, {params})
        .pipe( catchError(this.handleError(url)));

  }

  setObject(sessionId: string, id: any, object: any) {
    const url = `https://api.newstube.ru/urldev/Path/SetObject`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', id);
      return this.http.post<any>(url, object, {params})
        .pipe( catchError(this.handleError(url)));
  }

  deleteObject(sessionId: string, id: any) {
    const url = `https://api.newstube.ru/urldev/Path/Delete`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', id);
      return this.http.post<any>(url, {}, {params})
        .pipe( catchError(this.handleError(url)));
  }

  getLatin(text: string) {
    const url = `https://api.newstube.ru/urldev/Path/Latin`;
    const params = new HttpParams()
    .set('text', text);
    return this.http.get<ObjectBase>(url, {params})
      .pipe( catchError(this.handleError(url)));
  }

  createTag(sessionId: string, tag: any) {
    const url = `https://api.newstube.ru/urldev/Tag/Create`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
    return this.http.post<any>(url, tag, {params})
      .pipe( catchError(this.handleError(url)));
  }

  mediasAdd(sessionId: string, typeId: any, objectId: any, data: any) {
    const url = `https://api.newstube.ru/urldev/Path/MediasAdd`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('typeId', typeId)
      .set('objectId', objectId);

      return this.http.post<any>(url, data, {params})
        .pipe( catchError(this.handleError(url)));
  }

  mediasRemove(sessionId: string, typeId: any, objectId: any, data: any) {
    const url = `https://api.newstube.ru/urldev/Path/MediasAdd`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('typeId', typeId)
      .set('objectId', objectId);

      return this.http.post<any>(url, data, {params})
        .pipe( catchError(this.handleError(url)));
  }

  private handleError<T>(operation = 'operation', result?: T) {

    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      //console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.alertService.error(`Response ${operation} failed. ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return throwError(
        `Response ${operation} failed. ${error.message}`);
    }
  };


}
