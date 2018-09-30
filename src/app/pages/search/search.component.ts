import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { filter, finalize } from 'rxjs/operators'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  typeId: number = 0;
  @Input("pathId") pathId: number;

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    console.log(this.pathId);

    if (this.pathId)
      this.typeId = 1;

    //console.log(this.pathId);
    
    this.activatedRoute.queryParams
        .pipe(filter( param => param.typeId))
        .subscribe( (param: Params) => {
            if (param && Object.keys(param).length === 0) { // empty params

            }
            else {
              this.typeId = Number(param.typeId);
            }
      });
  }

  public setType(id: number): void {
    this.typeId = id;
    if (id)
      this.navigate();
    else  
      this.router.navigate([]);
  }

  public isActive(id: number): boolean{
    return this.typeId == id;
  }

  public navigate(replaceUrl?: boolean) {
    this.router.navigate([], { replaceUrl: replaceUrl || false, queryParams: {typeId: this.typeId} });
  }

}
