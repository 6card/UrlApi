import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'search-table',
    templateUrl: './search-table.component.html'
  })

export class SearchTableComponent implements OnInit {

    
    pageSize: number = 10;
    currentPage: number = 0;

    @Input() typeId: number;
    @Input() loading: boolean = false;
    @Input() items: Array<any>;
    @Input() totalItems: number = 0;

    @Output() pushPage = new EventEmitter<any>();

    ngOnInit() { }

    pageChange(pageNumber: number) {
        this.currentPage = pageNumber - 1;
        const page = {
            Start: this.currentPage * this.pageSize + 1,        
            Length: this.pageSize,        
            Sort: [        
                {        
                    Column: 1,        
                    Desc: true        
                }        
            ]        
        };

        this.pushPage.emit(page);
    }

}