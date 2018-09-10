import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

import { map, first } from 'rxjs/operators';
 
@Injectable({
    providedIn: 'root'
  })
export class AuthenticationService {
    sessionId: string;
    username: string;
    access: string = '2B646AA4-4ECC-43E0-8C42-4527329B0051';

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    
    ) {
        //let lcstg = localStorage.getItem('currentUser');
        let lcstg = this.cookieService.get('currentUser');
        this.sessionId = lcstg ? JSON.parse(lcstg).token : null;
        this.username = lcstg ? JSON.parse(lcstg).username : null;

        this.check();
    }

    private check() {
        const params = new HttpParams()
        .set('sessionId', this.sessionId);
        return this.http.get(`https://api.newstube.ru/v2/Auth/Check`, {params})
        .pipe(first())
        .subscribe(
            data => {
                if (data === false)
                    this.logout();
            },
            error => {
                console.log(error);               
            });
    }
 
    login(username: string, password: string) {
        return this.http.post<any>(`https://api.newstube.ru/v2/Auth/Login`, { UserName: username, Password: password })
            .pipe(
                first(),
                map(response => {

                let token = response && response.Data.SessionId;

                if (token) {
                    this.sessionId = token;
                    this.username = username;
                    //localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
                    this.cookieService.set('currentUser', JSON.stringify({ username: username, token: token }), 1);
                    return true;
                }
 
                return false;
            }));
    }
 
    logout() {
        // remove user from local storage to log user out
        this.username = null;
        this.sessionId = null;
        //localStorage.removeItem('currentUser');
        this.cookieService.delete('currentUser');
    }

    public isAuthenticated() {
        return this.sessionId ? true : false;
    }
}