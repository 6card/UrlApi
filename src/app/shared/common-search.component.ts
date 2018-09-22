import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { AuthenticationService } from '../services/auth.service';
import { SearchService } from '../services/search.service';
import { PathService } from '../services/path.service';

import { filter, finalize } from 'rxjs/operators'

const START_SQ = [{Operation:0,Columns:[]}];
const START_SP = { Start: 1, Length: 10, Sort: [{ Column: 1, Desc: true }]};

@Component({
    selector: 'common-search',
    templateUrl: '../pages/search/components/_search.component.html'
  })
  
export class CommonSearchComponent implements OnInit {
    

    public typeId;
    public meta;
    
    submitLoading: boolean = false;
    page: number = 1;

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
        let params: Params;
        
        /*
        this.activatedRoute.parent.params.subscribe(routeParams => {
            this.pathId = routeParams.id;
            //console.log(this.pathId);
        });

        */

        this.activatedRoute.queryParams
        .pipe(filter( param => param.q || param.p || param.typeId))
        .subscribe( (param: Params) => {
            if (param && Object.keys(param).length === 0) { // empty params

            }
            else {
                this.setSearchParams(Number(param.typeId), this.parseParam(param.q), this.parseParam(param.p))
                //this.searchQuery = this.parseParam(param.q);
                //this.searchPage = this.parseParam(param.p);
                //this.typeId = Number(param.typeId);
                this.getResults();
                this.getMeta();
            }
        });
        this.page = this.getPageNumber();  
    }

    getMeta(){
        this.searchService.getMeta(this.typeId)
        .subscribe(
            data => {
            //console.log(data);
                this.meta = data;
            },
            error => {
                //console.log(error);
                //this.alertService.error(error);                
        });
    }

    get firstQuery() {
      return {sq: this.searchQuery, sp: this.searchPage, typeId: this.typeId};
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

    private getPageNumber(): number {
        if (typeof this.searchPage === "undefined") return 1;
        return (this.searchPage.Start - 1) / 10 + 1 || 1;
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
        this.navigate();
    }
    
    public onQuery(searchQuery) {
        //this.page = 1;
        this.searchQuery = searchQuery;
        //this.getResults();
        this.navigate();
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
        const srl = this.serialize(this.searchQuery, this.searchPage);
        const params = {
            q: srl.q,
            p: srl.q,
            typeId: this.typeId
        }
        
        this.router.navigate([], { replaceUrl: replaceUrl || false, queryParams: params });
    }
    



    setObject(obj: any) {
        this.pathService.setObject(this.authenticationService.sessionId, this.pathId, {ObjectTypeId: this.typeId, ObjectId: obj.Id})
        .subscribe(
                data => {
                //console.log(data);
                    this.router.navigate([]);
                },
                error => {
                    //console.log(error);
                    //this.alertService.error(error);                
                });
    }

    onSetObject(obj: any) {
        if(confirm(`Вы уверены, что хотите установить этот объект?`)) {
            //console.log(`Set object to ${this.pathId}`);
            this.setObject(obj);
        }
    }

    getSerachType(index: number): string{

        const types = {
            1: "Channel",
            3: "Media",
            4: "Theme",
            5: "Person",
            6: "Tag",
            7: "Section",
            8: "Series",
        };

        return types[index] || null;
    }

    getResults() {
        this.submitLoading = true;
    
          //console.log(arr);
          this.searchService.search(this.getSerachType(this.typeId), this.authenticationService.sessionId, {Query: this.searchQuery, Page: this.searchPage})
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
    
          this.searchService.searchCount(this.getSerachType(this.typeId),this.authenticationService.sessionId, this.searchQuery)
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
}