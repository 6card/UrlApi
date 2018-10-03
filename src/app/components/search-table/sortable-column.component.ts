import { Component, OnInit, Input, EventEmitter, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';

import { Subscription } from 'rxjs';

import { SortService } from './sort.service';

@Component({
    selector: '[sortable-column]',
    templateUrl: './sortable-column.component.html'
})
export class SortableColumnComponent implements OnInit, OnDestroy {

    private columnSortedSubscription: Subscription;

    constructor(private sortService: SortService) { }

    @Input('sortable-column') columnName: number;

    @Input('sort-direction') sortDirection: string = '';

    //@ViewChild("sortLink") sortLink: ElementRef;
    //@HostListener('click')
    sort() {
        if (this.sortDirection === '')
            this.sortDirection = 'asc'
        else if (this.sortDirection === 'asc')
            this.sortDirection = 'desc'
        else if (this.sortDirection === 'desc')
            this.sortDirection = ''

        this.sortService.columnSorted({ sortColumn: this.columnName, sortDirection: this.sortDirection });
    }

    ngOnInit() { 
        // subscribe to sort changes so we can react when other columns are sorted
        /*
        this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(event => {
            console.log(event);
            // reset this column's sort direction to hide the sort icons
            const column = event.find( i => i.sortColumn == this.columnName);
            console.log(column);
            //this.sortDirection = column.sortDirection;
        });
        */
    }

    ngOnDestroy() {
        //this.columnSortedSubscription.unsubscribe();
    }
}