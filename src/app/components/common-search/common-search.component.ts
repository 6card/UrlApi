import { Component, OnInit, OnDestroy, Input, Output, EventEmitter  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { forkJoin } from 'rxjs';
import { filter, finalize, takeWhile, map } from 'rxjs/operators';

import { AuthenticationService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { PathService } from '../../services/path.service';
import { MetaService } from '../../services/meta.service';
import { SortService } from '../../components/search-table/sort.service';

import { Meta, MetaColumn } from '../../models/meta.model';
import { SearchQuery, SimpleQuery, PageQuery } from '../../models/search-query.model';

@Component({
    selector: 'common-search',
    templateUrl: './common-search.component.html',
    providers: [ MetaService, SortService ]
  })

export class CommonSearchComponent implements OnInit, OnDestroy {

    private alive: boolean = true;
    public typeId: number;
    public submitLoading: boolean = false;
    public searchResult: Array<any>;
    public searchItemsResult: number;
    public sq: SearchQuery;

    @Input() pathId: number;
    @Output() selectObject = new EventEmitter();

    constructor(
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        protected searchService: SearchService,
        protected authenticationService: AuthenticationService,
        protected pathService: PathService,
        private metaService: MetaService,
        private sortService: SortService
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams
        .pipe(filter( param => param.q || param.p || param.typeId))
        .subscribe( (param: Params) => {
            this.metaService.loadMeta(Number(param.typeId));
            this.setSearchParams(Number(param.typeId), this.parseParam(param.q), this.parseParam(param.p));
            this.getResults();
        });

        this.sortService.columnSorted$
        .pipe(takeWhile(() => this.alive))
        .subscribe(columns => {
            this.onSortChange(columns);
        });

    }

    ngOnDestroy() {
        this.alive = false;
    }

    setSearchParams(t: number, q: Array<SimpleQuery>, p: PageQuery) {
        this.sq = new SearchQuery(q, p);
        this.typeId = t;
        this.sortService.setInitSorted(this.sq.Page.Sort);
    }

    private parseParam(param: string) {
        if (typeof param === 'undefined') {
            return;
        }
        return JSON.parse(decodeURIComponent(param));
    }

    public onPageChange(pageNumber: number) {
        this.sq.setPage(pageNumber);
        this.navigate();
    }

    public onSortChange(columns) {
        this.sq.setSort(columns);
        this.navigate();
    }

    public onQuery(searchQuery: Array<SimpleQuery>) {
        this.sq.setQuery(searchQuery);
        this.navigate();
    }


    public serialize(query, page) {
      const q: string = encodeURIComponent(JSON.stringify(query));
      const p: string = encodeURIComponent(JSON.stringify(page));
      return {q: q, p: p};
    }

    public navigate(replaceUrl?: boolean) {
        const srl = this.serialize(this.sq.Query, this.sq.Page);
        const params = {
            q: srl.q,
            p: srl.p,
            typeId: this.typeId
        };
        this.router.navigate([], { replaceUrl: replaceUrl || false, queryParams: params });
    }

    setObject(obj: any) {
        this.selectObject.emit(obj);
    }

    getResults() {
        this.submitLoading = true;

        forkJoin (
            this.searchService.search(this.typeId, this.authenticationService.sessionId, this.sq),
            this.searchService.searchCount(this.typeId, this.authenticationService.sessionId, this.sq.Query),
        )
        .pipe(
            finalize(() => this.submitLoading = false),
            map( ([items, count]) => {
                return {Items: items, Count: count};
            })
        )
        .subscribe( data => {
            this.searchResult = data.Items;
            this.searchItemsResult = data.Count;
        });
    }
}
