import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs';

import { SortService } from './sort.service';

@Component({
    selector: '[sortable-column]',
    templateUrl: './sortable-column.component.html'
})
export class SortableColumnComponent {

    //private columnSortedSubscription: Subscription;

    constructor(private sortService: SortService) { }

    @Input('sortable-column') columnName: number;
    @Input('sort-direction') sortDirection: string = '';

    sort() {
        if (this.sortDirection === '')
            this.sortDirection = 'asc'
        else if (this.sortDirection === 'asc')
            this.sortDirection = 'desc'
        else if (this.sortDirection === 'desc')
            this.sortDirection = ''

        if (this.sortDirection)
            this.sortService.setSorted({ Column: this.columnName, Desc: this.sortDirection == 'desc' ? true : false });
        else
            this.sortService.clearSorted(this.columnName);
    }
}