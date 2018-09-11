import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../../services/auth.service';
import { PathService } from '../../../services/path.service';
import { SearchService } from '../../../services/search.service';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-path-search',
  templateUrl: './_search.component.html'
})
export class PathSearchComponent implements OnInit {
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
    private searchService: SearchService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() { }

  public onPageChange(page) {
    this.searchPage = page;
    this.getResults();
  }

  onQuery(searchQuery) {
    this.searchQuery = searchQuery;
    this.getResults();
  }

  getResults() {
    this.submitLoading = true;

      //console.log(arr);
      this.searchService.pathSearch(this.authenticationService.sessionId, {Query: this.searchQuery, Page: this.searchPage})
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

      this.searchService.pathSearchCount(this.authenticationService.sessionId, this.searchQuery)
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
