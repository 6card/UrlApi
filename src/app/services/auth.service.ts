import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
 
@Injectable({
    providedIn: 'root'
  })
export class AuthenticationService {
    sessionId: string;
    username: string;
    access: string = '2B646AA4-4ECC-43E0-8C42-4527329B0051';

    constructor(private http: HttpClient) {
        let lcstg = localStorage.getItem('currentUser');
        this.sessionId = lcstg ? JSON.parse(lcstg).token : null;
        this.username = lcstg ? JSON.parse(lcstg).username : null;
    }
 
    login(username: string, password: string) {
        return this.http.post<any>(`https://api.newstube.ru/v2/Auth/Login`, { UserName: username, Password: password })
            .pipe(map(response => {

                let token = response && response.Data.SessionId;

                if (token) {
                    this.sessionId = token;
                    this.username = username;
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
                    return true;
                }
 
                return false;
            }));
    }
 
    logout() {
        // remove user from local storage to log user out
        this.username = null;
        this.sessionId = null;
        localStorage.removeItem('currentUser');
    }

    public isAuthenticated() {
        return this.sessionId ? true : false;
    }
}