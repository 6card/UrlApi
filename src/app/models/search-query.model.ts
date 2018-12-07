/*
class ColumnQuery {
    Column: number;
    Operation: number;
    Value: number | Array<number>;
}

class TableQuery {
    Table: number;
    Values: Array<number>;
}

export class SimpleQuery {
    Operation: number = 0;
    Columns: Array<ColumnQuery> = [];
    Tables: Array<TableQuery> = [];

    constructor(operation?: number, columns?: Array<ColumnQuery>, tables?: Array<TableQuery>) {
        this.Operation = operation ? operation : 0;
        this.Columns = columns ? columns : [];
        this.Tables = tables ? tables : [];
    }
}

class SortQuery {
    Column: number = 1;
    Desc: boolean = false;
}

class PageQuery {
    Start: number = 1;
    Length: number = 10;
    Sort: Array<SortQuery> = [new SortQuery()];
}
*/

interface ColumnQuery {
    Column: number;
    Operation: number;
    Value: number | Array<number>;
}

interface TableQuery {
    Table: number;
    Values: Array<number>;
}

interface SortQuery {
    Column: number;
    Desc: boolean;
}

export interface PageQuery {
    Start: number;
    Length: number;
    Sort: Array<SortQuery>;
}

export interface SimpleQuery {
    Operation: number;
    Columns?: Array<ColumnQuery>;
    Tables?: Array<TableQuery>;
}


export class SearchQuery {
    Query: Array<SimpleQuery> = [];
    Page: PageQuery;

    private _defaultSort: SortQuery = { Column: 1,  Desc: false };
    private _defaultQuery: SimpleQuery = { Operation: 0, Columns: [],  Tables: [] };

    /*
    constructor(query?: Array<SimpleQuery>, page?: PageQuery) {
        this.Query = query ? query : [new SimpleQuery()];
        this.Page = page ? page : new PageQuery();
    }
    */

    constructor(query?: Array<SimpleQuery>, page?: PageQuery) {
        this.Query = query ? query : [this._defaultQuery];
        this.Page = page ? page : { Start: 1, Length: 10, Sort: [ this._defaultSort ] };
    }

    /*
    public setQueryPage(query?: Array<SimpleQuery>, page?: PageQuery) {
        if (query)
            this.Query = query;
        else
            this.Query = [this._defaultQuery];
        if (page)
            this.Page = page;
        else
            this.Page = { Start: 1, Length: 10, Sort: [ this._defaultSort ] };
    }
    */

    public resetQuery() {
        this.Query = [this._defaultQuery];
    }

    public setQuery(query: Array<SimpleQuery>) {
        this.Query = query;
        this.setPage(1);
    }

    public setPage(pageNumber: number) {
        this.Page.Start = (pageNumber - 1) * this.Page.Length + 1;
    }

    public setSort(columns: Array<SortQuery>) {
        if (columns.length === 0) {
            columns = [this._defaultSort];
        }
        this.Page.Sort = columns;
        this.setPage(1);
    }

    get currentPage(): number {
        return (this.Page.Start - 1) / this.Page.Length + 1 || 1;
    }

    /*
    set currentPage(page: number) {
        this.setPage(page);
    }
    */

    public addQuery(operation, columns, tables) {
        this.Query.push({Operation: operation, Columns: columns, Tables: tables });
    }

    public addUnionTableQuery(queryTable) {
        this.addQuery(0, [], queryTable);
    }

    public addIntersectTableQuery(queryTable) {
        this.addQuery(1, [], queryTable);
    }

    public addExceptTableQuery(queryTable) {
        this.addQuery(2, [], queryTable);
    }

    getColumnDirection(columnId: number) {
        const sortCoulumn = this.Page.Sort.find( s => s.Column === columnId);
        if (sortCoulumn) {
            return sortCoulumn.Desc ? 'desc' : 'asc';
        } else {
            return '';
        }
    }

    get queryWithoutPage() {
        delete this.Page;
        return this;
    }
}
