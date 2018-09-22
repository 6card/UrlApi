import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { SearchService } from '../../services/search.service';

@Component({
    selector: 'search-form',
    templateUrl: './search-form.component.html'
  })

export class SearchFormComponent implements OnInit, OnChanges  {

    @Input() firstQuery: any;
    private _firstQuery: any;
    @Input() loading: boolean = false;
    @Output() pushQuery = new EventEmitter<any>();

    @Input() meta: any;

    searchForm: FormGroup = this.formBuilder.group({
        items: this.formBuilder.array([])
    });

    constructor(
        private formBuilder: FormBuilder,
        private searchService: SearchService,
    ) { }

    ngOnInit() {
        //this.generateForm();
        //console.log(this.meta);
    }

    getColumns(){
        const col = this.meta.Columns.map(item =>  { return {id: item.Id, name: item.DisplayName || item.PropertyName} });
        //console.log(col);
        return col;
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

        const op = this.meta.Columns.filter(item => item.Id == columnId)[0].Operations;

        return operations.filter(item => {
            return op.includes(item.id);
        });
    }
    
    ngOnChanges(changes: SimpleChanges) {
        //if(changes.firstQuery && changes.firstQuery.isFirstChange()) {
        if(changes.firstQuery) {
            this._firstQuery = changes.firstQuery.currentValue;
            //console.log(changes.firstQuery);
            this.generateForm();
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

    createSearchItem(qop: number = 0, obj?: any) {
        return this.formBuilder.group({
          queryOperation: [qop, Validators.required],
          column: [obj? obj.Column: null, Validators.required],
          operation: [obj? obj.Operation : null, Validators.required],
          value: [obj? obj.Value : '', Validators.required]
        });
    }

    deleteSearchItem(index: number) {
        let searchItems: FormArray;    
        searchItems = this.searchForm.get('items') as FormArray;
        searchItems.removeAt(index);
      }
    
    addItem(qop? : number, obj?: any): void {
        let searchItems: FormArray;
        searchItems = this.searchForm.get('items') as FormArray;
        searchItems.push(this.createSearchItem(qop, obj));
    }

    getCondition(qop: number) {
        switch (qop) {
            case 0 : return "ИЛИ";
            case 1 : return "И";
            case 2 : return "НЕ";
            default: return "undefined"
        }
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
                    Value: item.value
                    }
                ]          
            };
        });

        this.pushQuery.emit(query);
    }
}