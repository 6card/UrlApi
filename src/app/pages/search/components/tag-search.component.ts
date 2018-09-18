import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { AuthenticationService } from '../../../services/auth.service';
import { SearchService } from '../../../services/search.service';
import { PathService } from '../../../services/path.service';

import { CommonSearchComponent }  from '../../../shared/common-search.component';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tag-search',
  templateUrl: './_search.component.html'
})
export class TagSearchComponent extends CommonSearchComponent {

  public typeId = 6;

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected searchService: SearchService,
    protected authenticationService: AuthenticationService,
    protected pathService: PathService
  ) { 
      super(router, activatedRoute, searchService, authenticationService, pathService);
  }

  getResults() {
    this.submitLoading = true;

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
          });
  }

  

}
