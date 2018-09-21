import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
    selector: 'search-form',
    templateUrl: './search-form.component.html'
  })

export class SearchFormComponent implements OnInit, OnChanges  {
 

    @Input() firstQuery: any;
    private _firstQuery: any;
    @Input() loading: boolean = false;
    @Output() pushQuery = new EventEmitter<any>();

    searchForm: FormGroup = this.formBuilder.group({
        items: this.formBuilder.array([])
    });

    constructor(
        private formBuilder: FormBuilder,
    ) {

    }

    
    ngOnChanges(changes: SimpleChanges) {
	  
        for (let propName in changes) {  
            let change = changes[propName];
            
            let curVal  = change.currentValue;
            let prevVal = change.previousValue;
            if (propName === 'firstQuery') {                
               this._firstQuery = curVal;
               this.generateForm();
            }
        }
    }

    /*
    ngOnChanges(changes: SimpleChanges) {
        
        const fq: SimpleChange = changes.firstQuery;
        console.log(fq)
        //if (!firstQuery.isFirstChange()) {
            this._firstQuery = fq.currentValue;

            this.searchForm = this.formBuilder.group({
                items: this.formBuilder.array([])
            });

            this.generateForm();
        //}
    }
    */

    generateForm() {
        this.clearSearchForm();
        //console.log(this._firstQuery.length);
        if (this._firstQuery) {
            //console.log(this.firstQuery);
            let arr = [];
            this._firstQuery.forEach( item => {
                //console.log(item);
                this.addItem(Number(item.Operation), item.Columns[0]);
            })
        }
        else {
            this.addItem(0);
        }
    }


    ngOnInit() {
        //this.generateForm();

        /*
        this.searchForm = this.formBuilder.group({
            items: this.formBuilder.array([ this.createTagSearchItem() ])
        });
        */        
    }

    clearSearchForm() {
        this.searchForm = this.formBuilder.group({
            items: this.formBuilder.array([])
        });
    }

    createTagSearchItem(qop: number = 0, obj?: any) {
        return this.formBuilder.group({
          queryOperation: [qop, Validators.required],
          column: [obj? obj.Column: null, Validators.required],
          operation: [obj? obj.Operation : null, Validators.required],
          value: [obj? obj.Value : '', Validators.required]
        });
    }

    deleteTagSearchItem(index: number) {
        let searchItems: FormArray;    
        searchItems = this.searchForm.get('items') as FormArray;
        searchItems.removeAt(index);
      }
    
    addItem(qop? : number, obj?: any): void {
        let searchItems: FormArray;
        searchItems = this.searchForm.get('items') as FormArray;
        searchItems.push(this.createTagSearchItem(qop, obj));
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