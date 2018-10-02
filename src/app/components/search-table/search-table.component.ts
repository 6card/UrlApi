import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Subscription } from 'rxjs';

import { SortService } from './sort.service';
import { Meta, MetaColumn } from '../../models/meta.model';
import { MetaService } from '../../services/meta.service';

@Component({
    selector: 'search-table',
    templateUrl: './search-table.component.html',
    providers: [SortService, MetaService]
  })

export class SearchTableComponent implements OnInit {

    public meta;

    @Input() currentPage: number = 0;
    @Input() typeId: number;
    @Input() loading: boolean = false;
    @Input() items: Array<any>;
    @Input() totalItems: number = 0;
    @Input() path: number;

    @Output() pushPage = new EventEmitter<any>();
    @Output() setObj = new EventEmitter<any>();
    @Output() pushSort = new EventEmitter();

    private columnSortedSubscription: Subscription;

    constructor(
        private sortService: SortService, 
        private metaService: MetaService
    ) { }

    ngOnInit() {
        this.getMeta(this.typeId);

        this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(columns => {
            //console.log(columns);
            this.pushSort.emit(columns);
        });
    }

    ngOnDestroy() {
        this.columnSortedSubscription.unsubscribe();
    }

    getMeta(typeId: number) {
        //this.metaLoading = true;

        this.metaService.getMeta(typeId)        
        //.pipe( finalize( () => this.metaLoading = false ) )
        .subscribe(
            (data: Meta) => { 
                this.meta = new Meta(data);
                this.setCortingColumns();
            },
            error => {}
        );
    }

    public setCortingColumns(){
        const columns = this.meta.Columns.filter( i => i.Sort == true).map( i => i.Id);
        this.sortService.setColumns(columns);
    }

    pageChange(pageNumber: number) {
       this.pushPage.emit(pageNumber);        
    }

    setObject(obj: any) {
        this.setObj.emit(obj);  
    }

}