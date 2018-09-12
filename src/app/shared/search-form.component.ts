import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
    selector: 'search-form',
    templateUrl: './search-form.component.html'
  })

export class SearchFormComponent implements OnInit {
    searchForm: FormGroup;

    @Input() firstQuery: any;
    @Input() loading: boolean = false;
    @Output() pushQuery = new EventEmitter<any>();

    constructor(
        private formBuilder: FormBuilder,
      ) { }

    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            items: this.formBuilder.array([])
        });

        if (this.firstQuery) {
            console.log(this.firstQuery);
            let arr = [];
            this.firstQuery.forEach( item => {
                console.log(item);
                this.addItem(item.Operation, item.Columns[0]);
            })
        }
        else {
            this.addItem(0);
        }

        /*
        this.searchForm = this.formBuilder.group({
            items: this.formBuilder.array([ this.createTagSearchItem() ])
        });
        */

        
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