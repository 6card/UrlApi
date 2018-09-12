import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { AuthenticationService } from '../../../services/auth.service';
import { PathService } from '../../../services/path.service';
import { SearchService } from '../../../services/search.service';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tag-search',
  templateUrl: './_search.component.html'
})
export class TagSearchComponent implements OnInit {
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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() { 
    let params: Params;
    

    this.activatedRoute.queryParams
    .subscribe( (param: Params) => {
        params = param;
        //console.log(params);
        if (params && Object.keys(params).length === 0) { // empty params
          //this.navigate(true);        
          //console.log(param);
        }
        else {
          let query: any = [];
        //console.log(param);
          
          //console.log(params["idx"]);

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
          //console.log(query);
          this.searchQuery = query;  
          this.getResults();
        }
        //

    });

  }

  public onPageChange(page) {
    this.searchPage = page;
    this.getResults();
  }

  onQuery(searchQuery) {
    this.searchQuery = searchQuery;
    //this.getResults();
    this.navigate();
  }

  getResults() {
    this.submitLoading = true;

      //console.log(arr);
      this.searchService.tagSearch(this.authenticationService.sessionId, {Query: this.searchQuery, Page: this.searchPage})
      .pipe(
        finalize(() => this.submitLoading = false)
      )
      .subscribe(
          data => {
            //console.log(data);
            this.searchResult = data;
          },
          error => {
              //console.log(error);
              //this.alertService.error(error);                
          });

      this.searchService.tagSearchCount(this.authenticationService.sessionId, this.searchQuery)
      .pipe(
        finalize(() => this.submitLoading = false)
      )
      .subscribe(
          data => {
            //console.log(data);
            this.searchItemsResult = data;
          },
          error => {
              //console.log(error);
              //this.alertService.error(error);                
          },
          () => {
            //this.submitLoading = false;
        });
  }

  serialize(obj, arr?: Array<any>, idx?: number){   

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

  navigate(replaceUrl?: boolean) {
    this.router.navigate(['/search/tag'], { replaceUrl: replaceUrl || false, queryParams: this.serialize(this.searchQuery) });
  }

}
