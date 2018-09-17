import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'search-table',
    templateUrl: './search-table.component.html'
  })

export class SearchTableComponent implements OnInit {

    @Input() currentPage: number = 0;
    @Input() typeId: number;
    @Input() loading: boolean = false;
    @Input() items: Array<any>;
    @Input() totalItems: number = 0;
    @Input() path: number;

    @Output() pushPage = new EventEmitter<any>();
    @Output() setObj = new EventEmitter<any>();

    ngOnInit() { }

    pageChange(pageNumber: number) {
       this.pushPage.emit(pageNumber);        
    }

    setObject(obj: any) {
        this.setObj.emit(obj);  
    }

}