import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { APP_API_URLS } from '../config/config';
import { APP_CONST } from '../config/const';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    sessionId: string;
    username: string;

    constructor(
        @Inject(APP_API_URLS) private API_URLS,
        @Inject(APP_CONST) private CONST,
        private http: HttpClient,
        private cookieService: CookieService,
    ) {
        // const lcstg = localStorage.getItem('currentUser');
        const lcstg = this.cookieService.get('currentUser');
        this.sessionId = lcstg ? JSON.parse(lcstg).token : null;
        this.username = lcstg ? JSON.parse(lcstg).username : null;

        // this.check();
    }

    check(sessionId: any) {
        const params = new HttpParams()
        .set('sessionId', sessionId)
        .set('access', this.CONST.AUTH_CHECK_ACCESS);
        return this.http.get(`${this.API_URLS.AUTH_ROOT}${this.API_URLS.AUTH_CHECK}`, {params})
    }

    checkAccess(username: string, sessionId: any) {
        const params = new HttpParams()
        .set('sessionId', sessionId)
        .set('access', this.CONST.AUTH_CHECK_ACCESS);
        return this.http.get(`${this.API_URLS.AUTH_ROOT}${this.API_URLS.AUTH_CHECK_ACCESS}`, {params})
        .pipe(
            map(response => {        
                if (sessionId === false) //
                    return 'Невероное имя пользователя или пароль'; 

                if (response === false)
                    return 'Нет доступа';

                this.sessionId = sessionId;
                this.username = username;
                // localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
                this.cookieService.set('currentUser', JSON.stringify({ username: username, token: sessionId }), 1);
                return true;
        
        }));
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${this.API_URLS.AUTH_ROOT}${this.API_URLS.AUTH_LOGIN}`, { UserName: username, Password: password })
        .pipe(
            switchMap( response => this.checkAccess(username, response && response.Success === true && response.Data.SessionId))
        );            
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
