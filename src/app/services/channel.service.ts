import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import {Observable, throwError, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private http: HttpClient) { }

  search(sessionId: string, data: any) {
  /*
    const data = {
      "Query": [
        {
          "Operation": 0,
          "Columns": [
            {
              "Column": 7,
              "Operation": 7,
              "Value": "погода"
            }
          ],
          "Tables": [
            {
              "Table": 6,
              "Values": [
                65
              ]
            }
          ]

        }
      ],
      "Page": {
        "Start": 0,
        "Length": 10,
        "Sort": [
          {
            "Column": 1,
            "Desc": true
          }
        ]
      }
    };

    */
    const params = new HttpParams()
    .set('sessionId', sessionId);

    return this.http.post<any>(`https://api.newstube.ru/urldev/Tag/Search`, data, {params})
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
