import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { finalize } from 'rxjs/operators';

import { Meta, MetaColumn } from '../../models/meta.model';
import { MetaService } from '../../services/meta.service';

@Component({
    selector: 'search-sub-form',
    templateUrl: './search-sub-form.component.html',
    providers: [ MetaService ]
  })

export class SearchSubFormComponent implements OnInit  {

    @Input() subForm: FormGroup;
    @Input() typeId: number;

    public meta;
    public metaLoading: boolean = false;

    public selectedColumn: number;
    public selectedOperation: number;

    constructor(
        private metaService: MetaService,
    ) { }
    
    ngOnInit() {
        this.getMeta(this.typeId);
        this.selectedColumn = this.subForm.get('column').value || null;
        this.selectedOperation = this.subForm.get('operation').value || null;
    }

    getMeta(typeId: number) {
        this.metaLoading = true;

        this.metaService.getMeta(typeId)        
        .pipe( finalize( () => this.metaLoading = false ) )
        .subscribe(
            (data: Meta) => { 
                this.meta = new Meta(data);
                this.setValueValidators();
            },
            error => {}
        );
    }

    setValueValidators() {
        if (this.selectedColumn) {
            let validators: Array<ValidatorFn> = [Validators.required];

            if (this.metaColumn.MaxLength)
                validators.push(Validators.maxLength(this.metaColumn.MaxLength));
            
            if (this.metaColumn.Type == 'Int32') {
                if(this.metaColumn.Operations.includes(9) && this.metaColumn.Operations.includes(10)) 
                    validators.push(this.digitsArrayValidator());
                else
                    validators.push(this.digitsValidator());
            }
            
            this.subForm.get('value').setValidators(validators);       
        }
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

        return null;
    }

    get metaColumn(): MetaColumn {
        return this.meta.Columns.filter( c => c.Id == this.selectedColumn)[0] || null;
    }

    onChangeColumn(id: number) {
        this.selectedColumn = id;
        this.setValueValidators();
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

    public controlIsInvalid(controlName: string): boolean {
        const control = this.subForm.get(controlName);
        return control.invalid && control.touched;
    }
}