import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SortService {

    private _columns: ColumnSorted[] = [];
    private columnSortedSource = new Subject<ColumnSorted[]>();
    columnSorted$ = this.columnSortedSource.asObservable();

    constructor() { }    

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
    }

    clearAllColumns() {
        this._columns = [];
        //this.columnSortedSource.next(this._columns);
    }

    setColumns(columns: number[]) {
        //this._columns = columns.map( i => new ColumnSorted(i));
    }
}

export interface ColumnSortedEvent {
    Column: number;
    Desc: boolean;
}

export class ColumnSorted {
    Column: number;
    Desc: boolean;
    constructor(id: number, descDirection: boolean = false) {
        this.Column = id;
        this.Desc = descDirection;
    }
}
