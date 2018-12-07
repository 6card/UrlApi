import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription, forkJoin } from 'rxjs';
import { finalize, map, takeWhile } from 'rxjs/operators';

import { AuthenticationService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { PathService } from '../../services/path.service';
import { AlertService } from '../../services/alert.service';
import { MetaService } from '../../services/meta.service';
import { SortService } from '../../components/search-table/sort.service';

import { SearchQuery, SimpleQuery } from '../../models/search-query.model';

@Component({
  selector: 'move-tag-modal',
  templateUrl: './move-tag-modal.component.html',
  providers: [ MetaService, SortService ]
})
export class MoveTagModal implements OnInit, OnDestroy {

    private alive: boolean = true;
    public loading: boolean = false;
    public searchResult: Array<any>;
    public searchItemsResult: number;
    public sq = new SearchQuery();
    public typeId: number = 4;

    @Input() currentItem;
    @Output() finishQuery = new EventEmitter();

    constructor(
        public activeModal: NgbActiveModal,
        protected metaService: MetaService,
        protected sortService: SortService, 
        protected searchService: SearchService,
        protected pathService: PathService,
        protected alertService: AlertService,
        protected authenticationService: AuthenticationService,
    ) {}

    ngOnInit() {        
        this.sortService.columnSorted$
        .pipe(takeWhile(() => this.alive))
        .subscribe(columns => {            
            this.onSortChange(columns);
        });

        this.getResults();
    }

    ngOnDestroy() {
        this.alive = false;
    }

    public setType(id: number): void {
        this.typeId = id;
        if (id) {
            this.sq = new SearchQuery();

            this.getResults();
            this.metaService.loadMeta(id);    
        }    
    }

    public isActive(id: number): boolean{
        return this.typeId == id;
    }


    getResults() {
        this.loading = true;

        forkJoin (
            this.searchService.search(this.typeId, this.authenticationService.sessionId, this.sq),
            this.searchService.searchCount(this.typeId,this.authenticationService.sessionId, this.sq.Query),
        )
        .pipe( 
            finalize(() => this.loading = false),
            map( ([items, count]) => {
                return {Items: items, Count: count};
            })            
        )
        .subscribe( data => {
            this.searchResult = data.Items;
            this.searchItemsResult = data.Count;
        });

    }


    public onQuery(searchQuery: Array<SimpleQuery>) {
        this.sq.setQuery(searchQuery);
        this.getResults();
    }

    public onPageChange(pageNumber: number) {
        this.sq.setPage(pageNumber);
        this.getResults();
    }

    public onSortChange(columns) {        
        this.sq.setSort(columns);
        this.getResults();
    }

    public setObject(item: any, objectTypeId: number) {
        if(confirm(
            `Вы уверены что хотите перенести ролики из объекта "${this.currentItem.ObjectTypeName}: ${this.currentItem.Name}" в "${this.searchService.getSerachTypeName(objectTypeId)}: ${item.Name}"?`
        )) {
            const obj = {
                "ObjectTypeId": objectTypeId,
                "ObjectId": item.Id
            };
           
            this.loading = true;
            this.pathService.moveAndDeleteTag(this.authenticationService.sessionId, this.currentItem.ObjectId, obj)
            .pipe( finalize(() => this.loading = false) )
            .subscribe( _ => {
                this.alertService.success('Ролики перенесены', 2000, true);
                this.activeModal.close();
                this.finishQuery.emit(obj);
            });
            
        }

    }

}