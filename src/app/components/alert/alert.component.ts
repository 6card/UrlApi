import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';

import { Alert, AlertType } from '../../models/alert';
import { AlertService } from '../../services/alert.service';

import { takeWhile } from 'rxjs/operators';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html',
    host: {'class' : 'messages'}
})

export class AlertComponent implements OnInit, OnDestroy {
    alerts: Alert[] = [];
    private alive: boolean = true;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getAlert()
        .pipe(
            takeWhile(() => this.alive)
        )
        .subscribe((alert: Alert) => {
            if (!alert) {
                // очищаем alerts получен пустой alert
                this.alerts = [];
                return;
            }
            // добавляем alert в массив
                this.alerts.push(alert);
                if (alert.timeout) {
                    setTimeout(() => {
                        this.alerts.splice(this.alerts.indexOf(alert), 1);
                   }, alert.timeout);
                }
        });
    }

    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }
        switch (alert.type) {
            case AlertType.Success:
                return 'alert-success';
            case AlertType.Error:
                return 'alert-danger';
            case AlertType.Info:
                return '';
            case AlertType.Warning:
                return 'alert-warning';
        }
    }

    ngOnDestroy() {
        this.alive = false;
    }
}
