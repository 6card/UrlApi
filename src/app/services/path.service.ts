import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { ObjectBase } from '../models/object-base';

import {Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PathService {

  constructor(private http: HttpClient) { }

  getByUrl(sessionId: string, url: string) {

    const params = new HttpParams()
    .set('sessionId', sessionId)
    .set('url', url);
    return this.http.get(`https://api.newstube.ru/urldev/Path/GetByUrl`, {params});
  }

  getByPathIdDetail(sessionId: string, id: any) {

    const params = new HttpParams()
    .set('sessionId', sessionId)
    .set('id', id);
    return this.http.get(`https://api.newstube.ru/urldev/Path/GetByPathIdDetail`, {params});
  }

  getByObjectDetail(sessionId: string, typeId: any, objectId: any) {

    const params = new HttpParams()
    .set('sessionId', sessionId)
    .set('objectId', objectId)
    .set('typeId', typeId);
    return this.http.get<ObjectBase>(`https://api.newstube.ru/urldev/Path/GetByObjectDetail`, {params});
  }

  updatePath(sessionId: string, data: any) {
    const params = new HttpParams()
      .set('sessionId', sessionId);
      return this.http.post<any>(`https://api.newstube.ru/urldev/Path/Update`, data, {params});

  }

  setObject(sessionId: string, id: any, object: any) {
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', id);
      return this.http.post<any>(`https://api.newstube.ru/urldev/Path/SetObject`, object, {params});
  }

  //http://localhost:4200/search/editpath/281499
  deleteObject(sessionId: string, id: any) {
    const params = new HttpParams()
      .set('sessionId', sessionId)
      .set('id', id);
      return this.http.post<any>(`https://api.newstube.ru/urldev/Path/Delete`, {}, {params});
  }


}
