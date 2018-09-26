import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { Alert, AlertType } from '../models/alert';

@Injectable()
export class AlertService {
    private subject = new Subject<Alert>();
    private keepAfterRouteChange = false;

    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert messages
                    this.clear();
                }
            }
        });
    }

    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, timeout: number = 0, keepAfterRouteChange = false) {
        this.alert(AlertType.Success, message, timeout, keepAfterRouteChange);
    }

    error(message: string, timeout: number = 0, keepAfterRouteChange = false) {
        this.alert(AlertType.Error, message, timeout, keepAfterRouteChange);
    }

    info(message: string, timeout: number = 0, keepAfterRouteChange = false) {
        this.alert(AlertType.Info, message, timeout, keepAfterRouteChange);
    }

    warn(message: string, timeout: number = 0, keepAfterRouteChange = false) {
        this.alert(AlertType.Warning, message, timeout, keepAfterRouteChange);
    }

    alert(type: AlertType, message: string, timeout: number = 0, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next(<Alert>{ type: type, message: message, timeout: timeout });    
    }

    clear() {
        // clear alerts
        this.subject.next();
    }
}