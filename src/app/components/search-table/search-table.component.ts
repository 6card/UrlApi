import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators'

import { SortService, ColumnSortedEvent } from './sort.service';
import { Meta, MetaColumn } from '../../models/meta.model';
import { MetaService } from '../../services/meta.service';

@Component({
    selector: 'search-table',
    templateUrl: './search-table.component.html',
    providers: [SortService]
  })

export class SearchTableComponent implements OnInit, OnDestroy {

    public meta;
    @Input() firstQuery: any;
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
    public metaSubscription: Subscription;

    constructor(
        private sortService: SortService, 
        private metaService: MetaService
    ) { }

    ngOnInit() {
        //this.getMeta(this.typeId);
        this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(columns => {
            //console.log(columns);
            this.pushSort.emit(columns);
        });

        this.metaSubscription = this.metaService.meta
        .pipe(
            //distinctUntilChanged()
        )
        .subscribe(
            (meta: Meta) => { 
                this.meta = new Meta(meta);
                this.sortService.clearAllColumns();
                this.setCortingColumns();
        });
    }

    /*
    ngOnChanges(changes: SimpleChanges) {
        if(changes.typeId) 
            this.sortService.clearAllColumns();
    }
    */

    ngOnDestroy() {
        this.columnSortedSubscription.unsubscribe();
        this.metaSubscription.unsubscribe();
    }

    getDirection(columnId: number) {
        if (!this.firstQuery)
            return '';
        const sortCoulumn = this.firstQuery.Sort.find( s => s.Column == columnId);
        if (sortCoulumn)
            return sortCoulumn.Desc ? 'desc' : 'asc';
        else
            return '';
    }

    public setCortingColumns(){
        const columns = this.meta.Columns.filter( i => i.Sort == true).map( i => i.Id);
        this.sortService.setColumns(columns);
        
        if (this.firstQuery) {
            this.firstQuery.Sort.map( sort => this.sortService.setSorted( {Column: sort.Column, Desc: sort.Desc}));
        }
    }

    pageChange(pageNumber: number) {
        this.pushPage.emit(pageNumber);        
    }

    setObject(obj: any) {
        this.setObj.emit(obj);  
    }

}