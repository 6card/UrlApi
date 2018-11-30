import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { forkJoin } from 'rxjs';
import { filter, finalize, takeWhile, map } from 'rxjs/operators'

import { AuthenticationService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { PathService } from '../../services/path.service';
import { MetaService } from '../../services/meta.service';
import { SortService } from '../../components/search-table/sort.service';

import { SearchQuery, SimpleQuery, PageQuery } from '../../models/search-query.model';

@Component({
  selector: 'app-batch-redirect',
  templateUrl: './batch-redirect.component.html',
  providers: [ MetaService, SortService ]
})
export class BatchRedirectComponent implements OnInit, OnDestroy {

    public typeId;
    public submitLoading: boolean = false;
    public urlListLoading: boolean = false;
    public searchResult: Array<any>;
    public searchItemsResult: number;
    public sq: SearchQuery;
    private alive: boolean = true;

    public selectedMediaIds: number[] = [];

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

            if (param && Object.keys(param).length === 0) { // empty params

            }
            else {
                console.log(this.parseParam(param.sm));
                this.metaService.loadMeta(Number(param.typeId));
                this.setSearchParams(Number(param.typeId), this.parseParam(param.q), this.parseParam(param.p), this.parseParam(param.sm));                
                this.getResults();
                
            }
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

    setSearchParams(t: number, q: Array<SimpleQuery>, p: PageQuery, sm: Array<number>) {
        this.sq = new SearchQuery(q, p);
        this.selectedMediaIds = sm;
        this.typeId = t;
        this.sortService.setInitSorted(this.sq.Page.Sort);
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

    private parseParam(param: string) {
        if (typeof param === "undefined") return;
        return JSON.parse(decodeURIComponent(param))
    }

    public setType(id: number): void {
        this.typeId = id;
        this.router.navigate([], { queryParams: {typeId: id}});
    }

    public isActive(id: number): boolean{
        return this.typeId == id;
    }

    public serialize(query, page, selm) {
        const q: string = encodeURIComponent(JSON.stringify(query));
        const p: string = encodeURIComponent(JSON.stringify(page));
        const sm: string = encodeURIComponent(JSON.stringify(selm));
        return {q: q, p: p, sm: sm};
    }

    public navigate(replaceUrl?: boolean) {
        const srl = this.serialize(this.sq.Query, this.sq.Page, this.selectedMediaIds);
        const params = {
            q: srl.q,
            p: srl.p,
            sm: srl.sm,
            typeId: this.typeId
        };        
        this.router.navigate([], { replaceUrl: replaceUrl || false, queryParams: params });
    }

    getResults() {
        this.submitLoading = true;

        forkJoin (
            this.searchService.search(this.typeId, this.authenticationService.sessionId, this.sq),
            this.searchService.searchCount(this.typeId,this.authenticationService.sessionId, this.sq.Query),
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

    public selectMedia(id: number) {
        this.selectedMediaIds.push(id);
        const srl = this.serialize(this.sq.Query, this.sq.Page, this.selectedMediaIds);
        const params = {
            q: srl.q,
            p: srl.p,
            sm: srl.sm,
            typeId: this.typeId
        }; 
        this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: params });
    }
}