import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription, forkJoin } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AuthenticationService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { PathService } from '../../services/path.service';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'add-redirect-modal',
    templateUrl: './add-redirect-modal.component.html'
})
export class AddRedirectModal {

    error: any = null;
    itemRedirect: any = null;
    public loading: boolean = false;

    @Input() pathId: number;
    @Output() onSetRedirect = new EventEmitter();

    constructor(
        private activeModal: NgbActiveModal,
        private searchService: SearchService,
        private pathService: PathService,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
    ) {}


    public showObject(obj: any | boolean) {
        if (obj) {   
            this.itemRedirect = obj;
            this.error = null;
            /*
            if(confirm(
                `Вы уверены что хотите установить Redirect на объект "${obj.ObjectTypeName}: ${obj.Name}"?`
            )) {
                this.setRedirect(obj);
            }
            */            
        }
        else {
            this.itemRedirect = null;
            this.error = "Путь не найден";
        }
    }

    public setRedirect(obj: any) {
        this.loading = true;
        this.pathService.createRedirect(this.authenticationService.sessionId, this.pathId, {Url: obj.Url})
        .pipe( finalize( () => this.loading = false ) )
        .subscribe(
            data => {
                this.alertService.success('Redirect установлен', 2000);
                this.activeModal.close();
                this.onSetRedirect.emit(true);
            }
        );
	}
}