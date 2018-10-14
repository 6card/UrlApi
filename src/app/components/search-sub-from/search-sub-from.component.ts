import { Component, OnInit, OnDestroy, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { finalize, distinctUntilChanged } from 'rxjs/operators';

import * as moment from 'moment';

import { Meta, MetaColumn } from '../../models/meta.model';
import { MetaService } from '../../services/meta.service';

@Component({
    selector: 'search-sub-form',
    templateUrl: './search-sub-form.component.html',
  })

export class SearchSubFormComponent implements OnInit, OnDestroy  {

    @Input() subForm: FormGroup;
    @Input() typeId: number;

    public meta;
    public metaLoading: boolean = false;
    public metaSubscription: Subscription;

    public selectedColumn: number;
    public selectedOperation: number;

    constructor(
        private metaService: MetaService,
    ) { }
    
    ngOnInit() {
        this.selectedColumn = this.subForm.get('column').value || null;
        this.selectedOperation = this.subForm.get('operation').value || null;
        this.metaSubscription = this.metaService.meta
        .pipe(
            //distinctUntilChanged()
        )
        .subscribe(
            (meta: Meta) => {
                this.meta = new Meta(meta);
                //this.setValueValidators();
        });
    }

    ngOnDestroy(): void {
        this.metaSubscription.unsubscribe();
    }

    setValueValidators() {
        if (this.selectedColumn) {
            let validators: Array<ValidatorFn> = [Validators.required];

            if (this.metaColumn.MaxLength)
                validators.push(Validators.maxLength(this.metaColumn.MaxLength));
            
            if (this.metaColumn.Type == 'Int32') {
                if( (this.metaColumn.Operations.indexOf(9) != -1) || (this.metaColumn.Operations.indexOf(10) != -1)) {
                    validators.push(this.digitsArrayValidator());
                    //console.log("array");
                }
                else {
                    validators.push(this.digitsValidator());
                    //console.log("number");
                }
            }

            if (this.metaColumn.Type == 'DateTime') {
                validators.push(this.datetimeValidator());
            }

            this.subForm.get('value').setValidators(validators);    
            this.subForm.get('value').updateValueAndValidity();   
        }
    }

    datetimeValidator(): ValidatorFn {
        
        const pattern: RegExp = new RegExp(/^\d{2}.\d{2}.\d{4}\s\d{2}:\d{2}$/i)
        return (control: AbstractControl): {[key: string]: any} | null => {
            const value = moment(control.value).format("DD.MM.YYYY HH:mm");
            //console.log(control.value);
            const forbidden = value.match(pattern);
            return !forbidden ? {'datetime': true} : null;
        };
    }

    digitsArrayValidator(): ValidatorFn {
        const pattern: RegExp = new RegExp(/^([0-9],?\s?)*$/i)
        return (control: AbstractControl): {[key: string]: any} | null => {
          const forbidden = control.value.match(pattern);
          return !forbidden ? {'digitsArray': true} : null;
        };
    }

    digitsValidator(): ValidatorFn {
        const pattern: RegExp = new RegExp(/^[0-9]*$/i)
        return (control: AbstractControl): {[key: string]: any} | null => {
          const forbidden = control.value.match(pattern);
          return !forbidden ? {'digits': true} : null;
        };
    }

    public getControlErrorMessage(controlName: string): string {
        const control = this.subForm.get(controlName);
        //console.log(control.errors);
        if (control.errors.required)
            return 'Поле обязательно для заполнения!'
        if (control.errors.maxlength) 
            return `Максимальная длина поля ${control.errors.maxlength.requiredLength} символов`;
        if (control.errors.digits) 
            return `Поле должно содержать только цифры`;
        if (control.errors.digitsArray) 
            return `Поле должно содержать только цифры или список цифр через запятую`; 
        if (control.errors.datetime) 
            return `Значение должно соответствовать шаблону "DD.MM.YYYY HH:mm"`; 

        return null;
    }

    get metaColumn(): MetaColumn {
        return this.meta.Columns.find( c => c.Id == this.selectedColumn) || null;
    }

    onChangeColumn(id: number) {   
        if (this.selectedColumn != id) {   
            this.selectedColumn = id;
            this.subForm.get('operation').setValue(null);
            this.subForm.get('value').setValue('');
            this.setValueValidators();
        }
    }

    onChangeOperation(id: number) {
        this.selectedOperation = id;
        //this.setValueValidators();
    }

    getColumns(){
        return this.meta.Columns
        .sort(function(a, b) {
          if (a.Id > b.Id) return 1;
          if (a.Id < b.Id) return -1;
          return 0;
        })
        .filter(item => item.Filter == true)
        .map(item =>  { return {id: item.Id, name: item.DisplayName || item.PropertyName} });
    }

    getOperations(columnId: number){
        const operations = [
            {id: 1, name: "равно"},
            {id: 2, name: "больше"},
            {id: 3, name: "меньше"},
            {id: 4, name: "больше или равно"},
            {id: 5, name: "меньше или равно"},
            {id: 6, name: "не равно"},
            {id: 7, name: "вхождение текста"},
            {id: 8, name: "текст не должен входить"},
            {id: 9, name: "список значенией"},
            {id: 10, name: "исключить список значений"},
            {id: 11, name: "в начале текста"},
            {id: 12, name: "в конце текста"},
            {id: 13, name: "не сначала текста"},
            {id: 14, name: "не с конца текста"},
        ];

        const op = this.metaColumn.Operations;

        return operations.filter(item => {
            return op.includes(item.id);
        });
    }

    getColumnValues() {
        let values = this.metaColumn.Values;
        return values || null;
    }

    /*
    getValue(controlName: string): string {
        const control = this.subForm.get(controlName);
        return control.value;
    }
    */

    isAutocomplete() {
        //return (this.selectedOperation == 9 || this.selectedOperation == 10);
        //console.log(this.metaColumn.ValueObjectType);
        return this.metaColumn.ValueObjectType && this.metaColumn.Type == 'Int32';
    }

    isDateTime() {
        //return (this.selectedOperation == 9 || this.selectedOperation == 10);
        return !this.metaColumn.ValueObjectType && this.metaColumn.Type == 'DateTime';
    }

    public controlIsInvalid(controlName: string): boolean {
        const control = this.subForm.get(controlName);
        return control.invalid && control.touched;
    }

    /*
    onPushInput(value: string) {
        this.subForm.get('value').setValue(value);
    }
    */
}