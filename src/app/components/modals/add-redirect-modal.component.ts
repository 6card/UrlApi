import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { finalize, debounceTime, distinctUntilChanged, takeWhile, first, filter, startWith } from 'rxjs/operators';

import { AuthenticationService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { PathService } from '../../services/path.service';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'add-redirect-modal',
    templateUrl: './add-redirect-modal.component.html'
})
export class AddRedirectModal implements OnInit, OnDestroy{

    urlForm: FormGroup;

    //error: any = null;
    itemRedirect: any = null;
    public loading: boolean = false;
    private alive: boolean = true;

    @Input() pathId: number;
    @Output() onSetRedirect = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private activeModal: NgbActiveModal,
        private searchService: SearchService,
        private pathService: PathService,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
    ) {}

    ngOnInit() {
        this.urlForm = this.formBuilder.group({
          url: [' https://www.newstube.ru/obrashchenie-putina', Validators.required],
        });

        this.urlForm.get('url').valueChanges
            .pipe( 
                takeWhile(() => this.alive),             
                debounceTime(300),
                distinctUntilChanged(),         
            )
            .subscribe( val => {
                this.getUrl(val);
        });
    }

    ngOnDestroy() { 
        this.alive = false;
    }


    public showObject(obj: any | boolean) {
        if (obj) {   
            this.itemRedirect = obj;
            //this.error = null;
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
            //this.error = "Путь не найден";
        }
    }

    public setRedirect(url: any) {
        this.loading = true;
        this.pathService.createRedirect(this.authenticationService.sessionId, this.pathId, {Url: url})
        .pipe( finalize( () => this.loading = false ) )
        .subscribe(
            data => {
                this.alertService.success('Redirect установлен', 2000);
                this.activeModal.close();
                this.onSetRedirect.emit(true);
            }
        );
    }

    public getUrl(url) {
        this.loading = true;
        this.itemRedirect = null;
        this.pathService.getByUrl(this.authenticationService.sessionId, url)
        .pipe( finalize(() => this.loading = false))
        .subscribe(data => this.itemRedirect = data);
    }

    onSubmit() {    
        if (this.urlForm.invalid) {
            return;
        }

        if(confirm(
            `Вы уверены что хотите установить Redirect на Url "${this.urlForm.controls.url.value}"?`
        )) {
            this.setRedirect(this.urlForm.controls.url.value);
        }

    }
}