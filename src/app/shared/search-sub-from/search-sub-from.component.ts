import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
    selector: 'search-sub-form',
    templateUrl: './search-sub-form.component.html'
  })

export class SearchSubFormComponent implements OnInit  {

    @Input() subForm: FormGroup;
    @Input() meta;
    private _meta;

    public selectedColumn: number;
    public selectedOperation: number;

    ngOnChanges(changes: SimpleChanges) {
      //if(changes.firstQuery && changes.firstQuery.isFirstChange()) {
      if(changes.meta) {
          this._meta = changes.meta.currentValue;
          //console.log(changes.firstQuery);
          //this.selectedColumn = null;
          //this.selectedOperation = null;
      }  
  }

    ngOnInit() {
      this.selectedColumn = this.subForm.get('column').value || null;
      this.selectedOperation = this.subForm.get('operation').value || null;
    }

    onChangeColumn(id: number) {
        this.selectedColumn = id;
    }

    onChangeOperation(id: number) {
      this.selectedOperation = id;
    }

    getCondition(qop: number) {
        switch (qop) {
            case 0 : return "ИЛИ";
            case 1 : return "И";
            case 2 : return "НЕ";
            default: return "undefined"
        }
    }

    getColumns(){
        const col = this._meta.Columns
        .sort(function(a, b) {
          if (a.Id > b.Id) return 1;
          if (a.Id < b.Id) return -1;
          return 0;
        })
        .filter(item => item.Filter == true)
        .map(item =>  { return {id: item.Id, name: item.DisplayName || item.PropertyName} });
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

        const op = this._meta.Columns.filter(item => item.Id == columnId)[0].Operations;

        return operations.filter(item => {
            return op.includes(item.id);
        });
    }

    public controlIsInvalid(control) {
        return control.invalid && control.touched;
    }
}