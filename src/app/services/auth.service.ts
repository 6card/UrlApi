import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

import { map, first } from 'rxjs/operators';

import { APP_API_URLS } from '../config/config';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    sessionId: string;
    username: string;

    constructor(
        @Inject(APP_API_URLS) private API_URLS,
        private http: HttpClient,
        private cookieService: CookieService,
    ) {
        // const lcstg = localStorage.getItem('currentUser');
        const lcstg = this.cookieService.get('currentUser');
        this.sessionId = lcstg ? JSON.parse(lcstg).token : null;
        this.username = lcstg ? JSON.parse(lcstg).username : null;

        // this.check();
    }

    private check() {
        const params = new HttpParams()
        .set('sessionId', this.sessionId);
        return this.http.get(`${this.API_URLS.AUTH_ROOT}${this.API_URLS.AUTH_CHECK}`, {params})
        .subscribe(
            data => {
                if (data === false) {
                    this.logout();
                }
            },
            error => {
                // console.log(error);
            });
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${this.API_URLS.AUTH_ROOT}${this.API_URLS.AUTH_LOGIN}`, { UserName: username, Password: password })
            .pipe(
                map(response => {

                const token = response && response.Data.SessionId;

                if (token) {
                    this.sessionId = token;
                    this.username = username;
                    // localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
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
        // localStorage.removeItem('currentUser');
        this.cookieService.delete('currentUser');
    }

    public isAuthenticated() {
        return this.sessionId ? true : false;
    }
}
