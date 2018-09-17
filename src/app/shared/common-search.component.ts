import { OnInit, Output, EventEmitter  } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { AuthenticationService } from '../services/auth.service';
import { SearchService } from '../services/search.service';

import { filter, first } from 'rxjs/operators'

export class CommonSearchComponent implements OnInit {
    submitLoading: boolean = false;
    page: number = 1;

    pathId: number;
    searchResult: Array<any>;
    searchItemsResult: number = 0;
    searchQuery: any;
    searchPage: any = {
        Start: 1,        
        Length: 10,        
        Sort: [        
            {        
                Column: 1,        
                Desc: true        
            }        
        ]        
    };

    @Output() setObj = new EventEmitter<any>();

    constructor(
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        protected searchService: SearchService,
        protected authenticationService: AuthenticationService
    ) { }

    ngOnInit() { 
        let params: Params;

        this.activatedRoute.parent.params.subscribe(routeParams => {
            this.pathId = routeParams.id;
            //console.log(this.pathId);
        });

        this.activatedRoute.queryParams
        .pipe(filter( param => param.q || param.p))
        .subscribe( (param: Params) => {
            if (param && Object.keys(param).length === 0) { // empty params

            }
            else {
              this.searchQuery = JSON.parse(decodeURIComponent(param.q));
              this.searchPage = JSON.parse(decodeURIComponent(param.p));
              this.getResults();
            }
        });
        this.page = this.getPageNumber();  
    }

    private getPageNumber(): number {
      return (this.searchPage.Start - 1) / 10 + 1;
    }

    public onPageChange(pageNumber: number) {
      //this.page = pageNumber;
      const page = {
            Start: (pageNumber - 1) * 10 + 1,        
            Length: 10,        
            Sort: [        
                {        
                    Column: 1,        
                    Desc: true        
                }        
            ]        
        };

        this.searchPage = page;
        //this.getResults();
        this.navigate(true);
    }
    
    public onQuery(searchQuery) {
        //this.page = 1;
        this.searchQuery = searchQuery;
        //this.getResults();
        this.navigate(true);
    }


    /*public serialize(obj, arr?: Array<any>, idx?: number){   

        let res: Array<any> = [];
    
        if (typeof arr !== "undefined")
          res = arr;
    
        obj.forEach((item, index) => {
          for (let key in item) {
            if (!Array.isArray(item[key])) {
              let k = `${key}${index}`;
              if (typeof idx !== "undefined")
                k += `_${idx}`;
              res[k] = item[key];
            }
            else {
              res = this.serialize(item[key], res, index);
            }
          }
          res["idx"] = index;
        });
        
        //console.log(res);
        return res;
    }
    */

    public serialize(query, page) {
      const q: string = encodeURIComponent(JSON.stringify(query));
      const p: string = encodeURIComponent(JSON.stringify(page));
      return {q: q, p: p};
    }
    
    public navigate(replaceUrl?: boolean) {
        this.router.navigate([], { replaceUrl: replaceUrl || false, queryParams: this.serialize(this.searchQuery, this.searchPage) });
    }
    
    getResults() {}

    onSetObject(obj: any) {
        console.log(`Set object to ${this.pathId}`);
    }
}