import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { AlertService } from './alert.service'

import { ObjectBase, MoveObject, Path, Tag } from '../models/object-base';
import { SimpleQuery } from '../models/search-query.model'

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

  getByPathIdDetail(sessionId: string, id: number) {
    const url = `https://api.newstube.ru/urldev/Path/GetByPathIdDetail`;
    const params = new HttpParams()
    .set('sessionId', sessionId)
    .set('id', String(id));
    return this.http.get(url, {params})
      .pipe( catchError(this.handleError(url)));
  }

  getByObjectDetail(sessionId: string, typeId: number, objectId: number) {
    const url = `https://api.newstube.ru/urldev/Path/GetByObjectDetail`;
    const params = new HttpParams()
    .set('sessionId', sessionId)
    .set('objectId', String(objectId))
    .set('typeId', String(typeId));
    return this.http.get<Path>(url, {params})
      .pipe( catchError(this.handleError(url)));
  }

  updatePath(sessionId: string, data: Path) {
    const url = `https://api.newstube.ru/urldev/Path/Update`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
      return this.http.post<any>(url, data, {params})
        .pipe( catchError(this.handleError(url)));

  }

  setObject(sessionId: string, id: number, object: MoveObject) {
    const url = `https://api.newstube.ru/urldev/Path/SetObject`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', String(id));
      return this.http.post<any>(url, object, {params})
        .pipe( catchError(this.handleError(url)));
  }

  deleteObject(sessionId: string, id: number) {
    const url = `https://api.newstube.ru/urldev/Path/Delete`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', String(id));
      return this.http.post<any>(url, {}, {params})
        .pipe( catchError(this.handleError(url)));
  }

  getLatin(text: string) {
    const url = `https://api.newstube.ru/urldev/Path/Latin`;
    const params = new HttpParams()
    .set('text', text);
    return this.http.get<string>(url, {params})
      .pipe( catchError(this.handleError(url)));
  }

  createTag(sessionId: string, tag: Tag) {
    const url = `https://api.newstube.ru/urldev/Tag/Create`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
    return this.http.post<number>(url, tag, {params})
      .pipe( catchError(this.handleError(url)));
  }

  deleteTag(sessionId: string, tagId: number) {
    const url = `https://api.newstube.ru/urldev/Tag/Delete`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', String(tagId));
    return this.http.post<any>(url, {}, {params})
      .pipe( catchError(this.handleError(url)));
  }

  moveAndDeleteTag(sessionId: string, tagId: Number, newTag: MoveObject) {
    const url = `https://api.newstube.ru/urldev/Tag/MoveAndDelete`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', String(tagId));
    return this.http.post<any>(url, newTag, {params})
      .pipe( catchError(this.handleError(url)));
  }

  deleteManyTags(sessionId: string, tagIds: Array<number>) {
    const url = `https://api.newstube.ru/urldev/Tag/DeleteMany`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
    return this.http.post<any>(url, {Ids: tagIds}, {params})
      .pipe( catchError(this.handleError(url)));
  }

  moveAndDeleteManyTags(sessionId: string, newTag: MoveObject) {
    const url = `https://api.newstube.ru/urldev/Tag/MoveAndDeleteMany`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
    return this.http.post<any>(url, newTag, {params})
      .pipe( catchError(this.handleError(url)));
  }

  mediasAdd(sessionId: string, typeId: number, objectId: number, data: Array<SimpleQuery>) {
    const url = `https://api.newstube.ru/urldev/Path/MediasAdd`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('typeId', String(typeId))
      .set('objectId', String(objectId));

      return this.http.post<any>(url, data, {params})
        .pipe( catchError(this.handleError(url)));
  }

  mediasRemove(sessionId: string, typeId: number, objectId: number, data: Array<SimpleQuery>) {
    const url = `https://api.newstube.ru/urldev/Path/MediasRemove`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('typeId', String(typeId))
      .set('objectId', String(objectId));

      return this.http.post<any>(url, data, {params})
        .pipe( catchError(this.handleError(url)));
  }

  mediasClear(sessionId: string, typeId: number, objectId: number) {
    const url = `https://api.newstube.ru/urldev/Path/MediasClear`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('typeId', String(typeId))
      .set('objectId', String(objectId));

      return this.http.post<any>(url, {params})
        .pipe( catchError(this.handleError(url)));
  }

  getParents(sessionId: string) {
    const url = `https://api.newstube.ru/urldev/Path/Parents`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
      return this.http.get<any>(url, {params})
        .pipe( catchError(this.handleError(url)));
  }

  createRedirect(sessionId: string, pathId: number, object: any) {
    const url = `https://api.newstube.ru/urldev/Path/CreateRedirect`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', String(pathId));
    return this.http.post<number>(url, object, {params})
      .pipe( catchError(this.handleError(url)));
  }

  createManyRedirect(sessionId: string, object: any) {
    const url = `https://api.newstube.ru/urldev/Path/CreateRedirectMany`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
    return this.http.post<number>(url, object, {params})
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
