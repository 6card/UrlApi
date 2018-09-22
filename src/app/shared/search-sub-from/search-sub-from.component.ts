import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
    selector: 'search-sub-form',
    templateUrl: './search-sub-form.component.html'
  })

export class SearchSubFormComponent implements OnInit  {

    @Input() subForm: FormGroup;

    public meta = {
        "Id": 6,
        "Columns": [
          {
            "Operations": [
              1,
              7,
              8,
              11,
              12,
              13,
              14
            ],
            "Id": 8,
            "GroupName": "Объект",
            "PropertyName": "Name",
            "DisplayName": "Название",
            "MaxLength": 1000,
            "Unique": false,
            "Type": "String",
            "Sort": true,
            "Filter": true,
            "ValueObjectType": 0
          },
          {
            "Operations": [
              1,
              7,
              8,
              11,
              12,
              13,
              14
            ],
            "Id": 2147483648,
            "GroupName": "SEO",
            "PropertyName": "SeoTitle",
            "DisplayName": "Title",
            "MaxLength": 1000,
            "Unique": false,
            "Type": "String",
            "Sort": true,
            "Filter": true,
            "ValueObjectType": 0
          },
          {
            "Operations": [
              1,
              7,
              8,
              11,
              12,
              13,
              14
            ],
            "Id": 4294967296,
            "GroupName": "SEO",
            "PropertyName": "SeoDescription",
            "DisplayName": "Description",
            "MaxLength": 4000,
            "Unique": false,
            "Type": "String",
            "Sort": true,
            "Filter": true,
            "ValueObjectType": 0
          },
          {
            "Operations": [
              1,
              7,
              8,
              11,
              12,
              13,
              14
            ],
            "Id": 8589934592,
            "GroupName": "SEO",
            "PropertyName": "SeoKeywords",
            "DisplayName": "Keywords",
            "MaxLength": 4000,
            "Unique": false,
            "Type": "String",
            "Sort": true,
            "Filter": true,
            "ValueObjectType": 0
          },
          {
            "Operations": [
              1
            ],
            "Id": 137438953472,
            "GroupName": "SEO",
            "PropertyName": "SeoNoIndex",
            "DisplayName": "Не индекcировать",
            "Unique": false,
            "Type": "Boolean",
            "Sort": true,
            "Filter": true,
            "ValueObjectType": 0
          },
          {
            "Operations": [
              1
            ],
            "Id": 274877906944,
            "GroupName": "SEO",
            "PropertyName": "SeoEnable",
            "DisplayName": "Опубликован",
            "Unique": false,
            "Type": "Boolean",
            "Sort": true,
            "Filter": true,
            "ValueObjectType": 0
          },
          {
            "Operations": [
              1,
              7,
              8,
              11,
              12,
              13,
              14
            ],
            "Id": 32,
            "GroupName": "Объект",
            "PropertyName": "Description",
            "DisplayName": "Описание",
            "MaxLength": 4000,
            "Unique": false,
            "Type": "String",
            "Sort": true,
            "Filter": true,
            "ValueObjectType": 0
          },
          {
            "Operations": [
              1,
              6,
              9,
              10
            ],
            "Id": 1,
            "PropertyName": "Id",
            "Unique": false,
            "Type": "Array",
            "Sort": false,
            "Filter": true,
            "ValueObjectType": 6
          },
          {
            "Operations": [
              1,
              6,
              9,
              10
            ],
            "Id": 8388608,
            "PropertyName": "PathId",
            "Unique": false,
            "Type": "Array",
            "Sort": false,
            "Filter": true,
            "ValueObjectType": 11
          },
          {
            "Operations": [
              1,
              7,
              8,
              11,
              12,
              13,
              14
            ],
            "Id": 16777216,
            "PropertyName": "PathLatin",
            "DisplayName": "Латиница",
            "MaxLength": 200,
            "Unique": false,
            "Type": "String",
            "Sort": true,
            "Filter": true,
            "ValueObjectType": 0
          },
          {
            "Operations": [
              1,
              2,
              3,
              4,
              5,
              6
            ],
            "Id": 33554432,
            "PropertyName": "PathSuffix",
            "DisplayName": "Суффикс",
            "Unique": false,
            "Type": "Int32",
            "Sort": true,
            "Filter": true,
            "ValueObjectType": 0
          },
          {
            "Operations": [
              1,
              6,
              9,
              10
            ],
            "Id": 67108864,
            "PropertyName": "ParentPathId",
            "Unique": false,
            "Type": "Array",
            "Sort": false,
            "Filter": true,
            "ValueObjectType": 11
          },
          {
            "Operations": [
              1,
              7,
              8,
              11,
              12,
              13,
              14
            ],
            "Id": 134217728,
            "PropertyName": "ParentPathLatin",
            "Unique": false,
            "Type": "String",
            "Sort": false,
            "Filter": true,
            "ValueObjectType": 0
          },
          {
            "Operations": [
              1,
              2,
              3,
              4,
              5,
              6
            ],
            "Id": 268435456,
            "PropertyName": "ParentPathSuffix",
            "Unique": false,
            "Type": "Int32",
            "Sort": false,
            "Filter": true,
            "ValueObjectType": 0
          },
          {
            "Id": 0,
            "PropertyName": "Url",
            "DisplayName": "Url",
            "Unique": false,
            "Type": "String",
            "Sort": false,
            "Filter": false,
            "ValueObjectType": 0
          },
          {
            "Id": 0,
            "PropertyName": "ParentPath",
            "DisplayName": "Родительский сегмент",
            "Unique": false,
            "Type": "String",
            "Sort": false,
            "Filter": false,
            "ValueObjectType": 0
          },
          {
            "Id": 0,
            "PropertyName": "Path",
            "DisplayName": "Сегмент",
            "Unique": false,
            "Type": "String",
            "Sort": false,
            "Filter": false,
            "ValueObjectType": 0
          }
        ],
        "Tables": [
          3
        ]
    };

    public selectedColumn: number;

    ngOnInit() {
        //this.generateForm();
        //console.log(this.myForm);
    }

    onChange(id: number) {
        this.selectedColumn = id;
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

    public controlIsInvalid(control) {
        return control.invalid && control.touched;
    }
}