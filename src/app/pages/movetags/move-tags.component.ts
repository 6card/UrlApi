import { Component, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { Router, ActivatedRoute, Params } from "@angular/router";

import { MetaService } from '../../services/meta.service';
import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';
import { SearchService } from '../../services/search.service';

import { SearchQuery, SimpleQuery } from '../../models/search-query.model';

import { forkJoin } from 'rxjs';
import { finalize, map, delay } from 'rxjs/operators';


@Component({
    selector: 'app-move-tags',
    templateUrl: './move-tags.component.html',
    //providers: [ MetaService ]
})

export class MoveTagsComponent implements OnInit{ 

    public tagIds: string;
    private _tagIds: Array<number>;
    public searchMedias: Array<any>;
    public searchMediasCount: number;
    public searchMediasQuery: SearchQuery;
    public loading: boolean = false;

    /*
    selectTagsForm: FormGroup = this.formBuilder.group({
        items: this.formBuilder.array([])
    });
    */

    constructor(
        private pathService: PathService,
        private searchService: SearchService,
        private authenticationService: AuthenticationService,
    ) { }

    ngOnInit() {
        //this.metaService.loadMeta(6);
    }

    onChangeTagsIds(ids: string) {
        this._tagIds = ids.split(', ').map( i => Number(i));
        let query: SimpleQuery = { Operation: 0, Columns: [], Tables: [ {Table: 6, Values: this._tagIds}] };
        this.searchMediasQuery = new SearchQuery([query]);
        this.getMediasItem();
    }


    public pageChange(page: number) {    
        this.searchMediasQuery.setPage(page);
        this.getMediasItem();    
    }

    public getMediasItem() {        

        this.loading = true;
  
        forkJoin (
            this.searchService.search(3, this.authenticationService.sessionId, this.searchMediasQuery),
            this.searchService.searchCount(3,this.authenticationService.sessionId, this.searchMediasQuery.Query),
        )
        .pipe( 
            finalize(() => this.loading = false),
            map( ([items, count]) => {
                return {Items: items, Count: count};
            })            
        )
        .subscribe( data => {
            this.searchMedias = data.Items;
            this.searchMediasCount = data.Count;
        });
        
      }

    /*
    ngOnChanges(changes: SimpleChanges) {
        const tagIds: SimpleChange = changes.tagIds;
        console.log('prev value: ', tagIds.previousValue);
        console.log('got tagIds: ', tagIds.currentValue);
    }
    */


}