import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import {Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private http: HttpClient) { }

  search(sessionId: string) {

    const data = {
      "Query": [
        {
          "Operation": 0,
          "Columns": [
            {
              "Column": 8,
              "Operation": 7,
              "Value": "обращение"
            }
          ],

        }
      ]
    };

    return this.http.post<any>(`https://api.newstube.ru/v2/Auth/Login`, { sessionId: sessionId, parameters: data });


  }

}
