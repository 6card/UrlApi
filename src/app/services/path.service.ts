import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AlertService } from './alert.service'

import { ObjectBase, MoveObject, Path, Tag } from '../models/object-base';
import { SimpleQuery } from '../models/search-query.model'

import { APP_API_URLS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class PathService {

  constructor(
    @Inject(APP_API_URLS) private API_URLS,
    private http: HttpClient,
    private alertService: AlertService
    ) { }

  getByUrl(sessionId: string, str: string) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.PATH_GET_BY_URL}`;
    const params = new HttpParams()
    .set('sessionId', sessionId)
    .set('url', str);
    return this.http.get(url, {params})
      .pipe( catchError(this.handleError(url)));
  }

  getByPathIdDetail(sessionId: string, id: number) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.PATH_GET_BY_PATH_ID_DETAIL}`;
    const params = new HttpParams()
    .set('sessionId', sessionId)
    .set('id', String(id));
    return this.http.get(url, {params})
      .pipe( catchError(this.handleError(url)));
  }

  getByObjectDetail(sessionId: string, typeId: number, objectId: number) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.PATH_GET_BY_OBJECT_DETAIL}`;
    const params = new HttpParams()
    .set('sessionId', sessionId)
    .set('objectId', String(objectId))
    .set('typeId', String(typeId));
    return this.http.get<Path>(url, {params})
      .pipe( catchError(this.handleError(url)));
  }

  updatePath(sessionId: string, data: Path) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.PATH_UPDATE}`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
      return this.http.post<any>(url, data, {params})
        .pipe( catchError(this.handleError(url)));

  }

  setObject(sessionId: string, id: number, object: MoveObject) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.PATH_SET_OBJECT}`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', String(id));
      return this.http.post<any>(url, object, {params})
        .pipe( catchError(this.handleError(url)));
  }

  deleteObject(sessionId: string, id: number) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.PATH_DELETE}`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', String(id));
      return this.http.post<any>(url, {}, {params})
        .pipe( catchError(this.handleError(url)));
  }

  getLatin(text: string) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.PATH_LATIN}`;
    const params = new HttpParams()
    .set('text', text);
    return this.http.get<string>(url, {params})
      .pipe( catchError(this.handleError(url)));
  }

  createTag(sessionId: string, tag: Tag) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.TAG_CREATE}`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
    return this.http.post<number>(url, tag, {params})
      .pipe( catchError(this.handleError(url)));
  }

  deleteTag(sessionId: string, tagId: number) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.TAG_DELETE}`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', String(tagId));
    return this.http.post<any>(url, {}, {params})
      .pipe( catchError(this.handleError(url)));
  }

  moveAndDeleteTag(sessionId: string, tagId: Number, newTag: MoveObject) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.TAG_MOVE_AND_DELETE}`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', String(tagId));
    return this.http.post<any>(url, newTag, {params})
      .pipe( catchError(this.handleError(url)));
  }

  deleteManyTags(sessionId: string, tagIds: Array<number>) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.TAG_DELETE_MANY}`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
    return this.http.post<any>(url, {Ids: tagIds}, {params})
      .pipe( catchError(this.handleError(url)));
  }

  moveAndDeleteManyTags(sessionId: string, newTag: MoveObject) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.TAG_MOVE_AND_DELETE_MANY}`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
    return this.http.post<any>(url, newTag, {params})
      .pipe( catchError(this.handleError(url)));
  }

  mediasAdd(sessionId: string, typeId: number, objectId: number, data: Array<SimpleQuery>) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.PATH_MEDIAS_ADD}`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('typeId', String(typeId))
      .set('objectId', String(objectId));

      return this.http.post<any>(url, data, {params})
        .pipe( catchError(this.handleError(url)));
  }

  mediasRemove(sessionId: string, typeId: number, objectId: number, data: Array<SimpleQuery>) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.PATH_MEDIAS_REMOVE}`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('typeId', String(typeId))
      .set('objectId', String(objectId));

      return this.http.post<any>(url, data, {params})
        .pipe( catchError(this.handleError(url)));
  }

  mediasClear(sessionId: string, typeId: number, objectId: number) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.PATH_MEDIAS_CLEAR}`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('typeId', String(typeId))
      .set('objectId', String(objectId));

      return this.http.post<any>(url, {params})
        .pipe( catchError(this.handleError(url)));
  }

  getParents(sessionId: string) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.PATH_PARENTS}`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
      return this.http.get<any>(url, {params})
        .pipe( catchError(this.handleError(url)));
  }

  createRedirect(sessionId: string, pathId: number, object: any) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.PATH_CREATE_REDIRECT}`;
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', String(pathId));
    return this.http.post<number>(url, object, {params})
      .pipe( catchError(this.handleError(url)));
  }

  createManyRedirect(sessionId: string, object: any) {
    const url = `${this.API_URLS.ROOT}${this.API_URLS.PATH_CREATE_REDIRECT_MANY}`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
    return this.http.post<number>(url, object, {params})
      .pipe( catchError(this.handleError(url)));
  }

  private handleError<T>(operation = 'operation', result?: T) {

    return (error: any): Observable<T> => {

      this.alertService.error(`Response ${operation} failed. ${error.message}`);

      return throwError(
        `Response ${operation} failed. ${error.message}`);
    }
  };


}
