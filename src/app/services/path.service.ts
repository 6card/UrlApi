import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

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

}
