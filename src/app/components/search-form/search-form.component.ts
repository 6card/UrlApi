import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { MetaService } from '../../services/meta.service';

@Component({
    selector: 'search-form',
    templateUrl: './search-form.component.html'
  })

export class SearchFormComponent implements OnInit, OnDestroy, OnChanges  {

    public metaSubscription: Subscription;

    @Input() typeId: any;
    @Input() firstQuery: any;

    @Input() loading: boolean = false;
    @Output() pushQuery = new EventEmitter<any>();

    searchForm: FormGroup = this.formBuilder.group({
        items: this.formBuilder.array([])
    });

    constructor(
        private formBuilder: FormBuilder,
        private metaService: MetaService,
    ) { }

    ngOnInit() {
        this.metaSubscription = this.metaService.meta
        .subscribe(_ => this.generateForm());
    }

    ngOnDestroy(): void {
        this.metaSubscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {    
        /*    
        if(changes.firstQuery) {
            this.generateForm(); //переделываем форму при изменении typeId или firstQuery
        }
        */
    }

    getCondition(qop: number) {
        switch (qop) {
            case 0 : return "ИЛИ";
            case 1 : return "И";
            case 2 : return "НЕ";
            default: return "undefined"
        }
    }

    generateForm() {
        this.clearSearchForm();
        if (this.firstQuery[0].Columns.length > 0) {
            this.firstQuery.forEach( item => {
                this.addItem(Number(item.Operation), item.Columns[0]);
            })
        }
        else {
            this.addItem(0);
        }
    }

    clearSearchForm() {
        this.searchForm = this.formBuilder.group({
            items: this.formBuilder.array([])
        });
    }

    addItem(qop? : number, obj?: any): void {
        let searchItems: FormArray;
        searchItems = this.searchForm.get('items') as FormArray;
        searchItems.push(this.createSearchItem(qop, obj));
    }

    createSearchItem(qop: number = 0, obj?: any) {
        return this.formBuilder.group({
          queryOperation: [qop, Validators.required],
          column: [obj? obj.Column: null, Validators.required],
          operation: [obj? obj.Operation : null, Validators.required],
          value: [obj? this.arrayToString(obj.Value) : '', Validators.required]
        });
    }

    arrayToString(value) {
        return Array.isArray(value) ? value.join(', ') : value;
    }

    deleteSearchItem(index: number) {
        let searchItems: FormArray;    
        searchItems = this.searchForm.get('items') as FormArray;
        searchItems.removeAt(index);
    }

    public controlIsInvalid(control) {
        return control.invalid && control.touched;
    }

    public getGroupControls(){
        let searchItems: FormArray;
        searchItems = this.searchForm.get('items') as FormArray;
        return (<any>Object).values(searchItems.controls);
    }

    public markFormGroupTouched(formGroup: FormGroup) {
        let searchItems: FormArray;
        searchItems = formGroup.get('items') as FormArray;
        (<any>Object).values(searchItems.controls).forEach(control => {
          control.get('column').markAsTouched();
          control.get('operation').markAsTouched();
          control.get('value').markAsTouched();
        });
    }

    getInputValue(op: number, val: string) {
        if (op == 9 || op == 10)            
            return val.split(', ');
        return val;
    }

    onSubmit() {
        this.markFormGroupTouched(this.searchForm);

        if (!this.searchForm.valid)
            return;

        const query = this.searchForm.controls.items.value
        .map(item => {
            return {
                Operation: item.queryOperation,  
                Columns: [
                    {
                    Column: item.column, 
                    Operation: item.operation, 
                    Value: this.getInputValue(item.operation, item.value)
                    }
                ]          
            };
        });

        this.pushQuery.emit(query);
    }
}