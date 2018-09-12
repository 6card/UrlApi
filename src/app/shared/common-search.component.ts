import { OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { AuthenticationService } from '../services/auth.service';
import { SearchService } from '../services/search.service';

export class CommonSearchComponent implements OnInit {
    submitLoading: boolean = false;

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

    constructor(
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        protected searchService: SearchService,
        protected authenticationService: AuthenticationService
    ) { }

    ngOnInit() { 
        let params: Params;

        this.activatedRoute.queryParams
        .subscribe( (param: Params) => {
            params = param;
            if (params && Object.keys(params).length === 0) { // empty params

            }
            else {
              let query: any = [];    
              for (var i = 0; i < Number(params["idx"])+1; i++) {
                query.splice(i, 0,{
                  Operation: params[`Operation${i}`],
                  Columns: [
                    {
                      Column: params[`Column0_${i}`],
                      Operation: params[`Operation0_${i}`],
                      Value: params[`Value0_${i}`],
                    }
                  ]
                });
              }
              this.searchQuery = query;  
              this.getResults();
            }
    
        });
    
    }
    public onPageChange(page) {
        this.searchPage = page;
        this.getResults();
      }
    
    public onQuery(searchQuery) {
        this.searchQuery = searchQuery;
        //this.getResults();
        this.navigate();
    }


    public serialize(obj, arr?: Array<any>, idx?: number){   

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
    
    public navigate(replaceUrl?: boolean) {
        this.router.navigate([], { replaceUrl: replaceUrl || false, queryParams: this.serialize(this.searchQuery) });
    }
    
    getResults() {}
}