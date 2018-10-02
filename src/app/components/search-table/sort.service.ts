import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SortService {

    private _columns: Array<ColumnSorted>;

    constructor() { }

    private columnSortedSource = new Subject<ColumnSorted[]>();

    columnSorted$ = this.columnSortedSource.asObservable();

    columnSorted(event: ColumnSortedEvent) {
        this._columns.find( i => i.sortColumn == event.sortColumn).sortDirection = event.sortDirection;
        this.columnSortedSource.next(this._columns);
    }

    setColumns(columns: number[]) {
        this._columns = columns.map( i => new ColumnSorted(i));
    }
}

export interface ColumnSortedEvent {
    sortColumn: number;
    sortDirection: string;
}

export class ColumnSorted {
    sortColumn: number;
    sortDirection: string;
    constructor(id: number, direction: string = '') {
        this.sortColumn = id;
        this.sortDirection = direction;
    }

    get Column() {
        return this.sortColumn;
    }

    get Desc() {
        if (this.sortDirection === 'asc')
            return false;
        else if (this.sortDirection === 'desc')
            return true;
    }
}
