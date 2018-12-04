import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { filter, finalize } from 'rxjs/operators'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  typeId: number = 0;
  error: any = null;
  @Input("pathId") pathId: number;
  @Output() selectObject = new EventEmitter();

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    
    this.activatedRoute.queryParams
        //.pipe(filter( param => param.typeId))
        .subscribe( (param: Params) => {
          this.typeId = Number(param.typeId) || 0;
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

  public setObject(obj: any) {
    this.selectObject.emit(obj);
  }

  public navigateToPath(obj: any | boolean) {
    if (obj)
      this.router.navigate(['/path', obj.Id]);
    else {
      this.error = "Путь не найден";
    }
  }

}
