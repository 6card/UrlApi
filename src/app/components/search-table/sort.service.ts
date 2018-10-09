import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SortService {

    private _columns: ColumnSorted[] = [];

    constructor() { }

    private columnSortedSource = new Subject<ColumnSorted[]>();

    columnSorted$ = this.columnSortedSource.asObservable();

    clearSorted(colunmId: number) {
        const sortedColumn = this._columns.find( i => i.Column == colunmId);
        if (sortedColumn)
            this._columns.splice(this._columns.indexOf(sortedColumn), 1);
        this.columnSortedSource.next(this._columns);
    }

    setSorted(event: ColumnSortedEvent) {
        if (event.Column == 1)
            return;
        const sortedColumn = this._columns.find( i => i.Column == event.Column);
        if (sortedColumn)
            sortedColumn.Desc = event.Desc;
        else 
            this._columns.push(event);

        this.columnSortedSource.next(this._columns);

        /*
        const sortedColumn = this._columns.find( i => i.sortColumn == event.sortColumn);
        if (sortedColumn)
            sortedColumn.sortDirection = event.sortDirection;
        this.columnSortedSource.next(this._columns);
        */
    }

    clearAllColumns() {
        this._columns = [];
        this.columnSortedSource.next(this._columns);
    }

    setColumns(columns: number[]) {
        //this._columns = columns.map( i => new ColumnSorted(i));
    }
}

export interface ColumnSortedEvent {
    Column: number;
    Desc: boolean;
    /*
    sortColumn: number;
    sortDirection: string;
    */
}

export class ColumnSorted {
    Column: number;
    Desc: boolean;
    constructor(id: number, descDirection: boolean = false) {
        this.Column = id;
        this.Desc = descDirection;
    }

    /*
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
    */
}
