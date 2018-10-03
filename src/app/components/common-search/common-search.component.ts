import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { AuthenticationService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { PathService } from '../../services/path.service';

import { filter, finalize } from 'rxjs/operators'

export const START_SQ = [{ Operation:0, Columns:[] }];
export const START_SS = [{ Column: 1, Desc: false }];
export const START_SP = { Start: 1, Length: 10, Sort: START_SS};

@Component({
    selector: 'common-search',
    templateUrl: './common-search.component.html',
  })
  
export class CommonSearchComponent implements OnInit {
    

    public typeId;
    public meta;
    
    submitLoading: boolean = false;

    @Input() pathId: number;
    searchResult: Array<any>;
    searchItemsResult: number = 0;
    searchQuery: any = START_SQ;
    searchPage: any = START_SP;

    constructor(
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        protected searchService: SearchService,
        protected authenticationService: AuthenticationService,
        protected pathService: PathService
    ) { }

    ngOnInit() { 
        this.activatedRoute.queryParams
        .pipe(filter( param => param.q || param.p || param.typeId))
        .subscribe( (param: Params) => {
            if (param && Object.keys(param).length === 0) { // empty params

            }
            else {
                this.setSearchParams(Number(param.typeId), this.parseParam(param.q), this.parseParam(param.p))

                this.getResults();
            }
        }); 
    }


    setSearchParams(t: number, q: string, p: string) {
        if (q) 
            this.searchQuery = q;
        else
            this.searchQuery = START_SQ;
        if (p) 
            this.searchPage = p;
        else
            this.searchPage = START_SP;
        this.typeId = t;
    }

    private parseParam(param: string) {
        if (typeof param === "undefined") return;
        return JSON.parse(decodeURIComponent(param))
    }

    get page(): number {
        if (typeof this.searchPage === "undefined") return 1;
        return (this.searchPage.Start - 1) / 10 + 1 || 1;
    }

    public onPageChange(pageNumber: number) {
        const page = {
            Start: (pageNumber - 1) * 10 + 1,        
            Length: 10,        
            Sort: START_SS     
        };

        this.searchPage = page;
        this.navigate();
    }

    public onSortChange(columns) {
        

        let sort = columns.filter( i => i.sortDirection).map(i => {return {Column: i.Column, Desc: i.Desc}});
        if (sort.length == 0) sort = START_SS;

        const page = {
            Start: 1,        
            Length: 10,        
            Sort: sort      
        };


        this.searchPage = page;
        this.navigate();
    }
    
    public onQuery(searchQuery) {
        this.searchQuery = searchQuery;
        this.navigate();
    }


    public serialize(query, page) {
      const q: string = encodeURIComponent(JSON.stringify(query));
      const p: string = encodeURIComponent(JSON.stringify(page));
      return {q: q, p: p};
    }
    
    public navigate(replaceUrl?: boolean) {
        const srl = this.serialize(this.searchQuery, this.searchPage);
        const params = {
            q: srl.q,
            p: srl.p,
            typeId: this.typeId
        }
        
        this.router.navigate([], { replaceUrl: replaceUrl || false, queryParams: params });
    }

    setObject(obj: any) {
        this.pathService.setObject(this.authenticationService.sessionId, this.pathId, {ObjectTypeId: this.typeId, ObjectId: obj.Id})
        .subscribe(
            data => { this.router.navigate([]); },
            error => {}
        );
    }

    onSetObject(obj: any) {
        if(confirm(`Вы уверены, что хотите установить этот объект?`)) {
            this.setObject(obj);
        }
    }

    getResults() {
        this.submitLoading = true;

            this.searchService.search(this.typeId, this.authenticationService.sessionId, {Query: this.searchQuery, Page: this.searchPage})
            .pipe(
                finalize(() => this.submitLoading = false)
            )
            .subscribe(
              data => { this.searchResult = data; },
              error => {}
            );
    
            this.searchService.searchCount(this.typeId,this.authenticationService.sessionId, this.searchQuery)
            .pipe(
                finalize(() => this.submitLoading = false)
            )
            .subscribe(
                data => { this.searchItemsResult = data; },
                error => { },
                () => { }
            );
      }
}