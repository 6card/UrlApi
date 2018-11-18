import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription, forkJoin } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AuthenticationService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { PathService } from '../../services/path.service';
import { AlertService } from '../../services/alert.service';
import { MetaService } from '../../services/meta.service';
import { SortService } from '../../components/search-table/sort.service';

import { CheckedMedia } from '../../models/media';
import { SearchQuery, SimpleQuery } from '../../models/search-query.model';

import { APP_CONST } from '../../config/const';


@Component({
  selector: 'add-medias-modal',
  templateUrl: './add-medias-modal.component.html',
  providers: [ MetaService, SortService ]
})
export class AddMediasModal implements OnInit, OnDestroy, AfterViewInit {

    public medias: Array<CheckedMedia>;
    public searchItems: Array<any>;
    public searchItemsCount: number;
    public searchQueryCount: number;
    public loading: boolean = false;
    public sq = new SearchQuery();

    //dialogMediaAction: DialogMediaAction;

    @Input() objectSq: SearchQuery;
    @Input() mode;
    @Input() objectId: number;
    @Input() objectTypeId: number;
    @Output() finishQuery = new EventEmitter();

    private _columnSortedSubscription: Subscription;    

    constructor(
        @Inject(APP_CONST) private config,
        public activeModal: NgbActiveModal,
        private metaService: MetaService,
        private sortService: SortService, 
        private searchService: SearchService,
        private pathService: PathService,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
    ) {}

    ngOnInit() {        
        this.metaService.loadMeta(3);
        //console.log('ngOnInit');
        //this.loadMedias(this.sq);
        this._columnSortedSubscription = this.sortService.columnSorted$.subscribe(columns => {
            this.onSortChange(columns);
        });

        this.loadMedias(this.sq);
    }

    ngOnDestroy() {
        this._columnSortedSubscription.unsubscribe();
    }

    ngAfterViewInit() { }

    public loadMedias(searchQuery: SearchQuery) {
        let search = new SearchQuery( Object.assign([], searchQuery.Query), Object.assign({}, searchQuery.Page));
        
        if (this.mode == this.config.ADD)
            search.addExceptTableQuery(this.objectSq);
        else if (this.mode == this.config.DELETE)
            search.addIntersectTableQuery(this.objectSq);

        this.loading = true;
        forkJoin (
            this.searchService.search(3, this.authenticationService.sessionId, search),
            this.searchService.searchCount(3, this.authenticationService.sessionId, search.Query),
            this.searchService.searchCount(3, this.authenticationService.sessionId, this.sq.Query),
        )
        .pipe( 
            finalize(() => this.loading = false),
            map( ([items, count, countAll]) => {
                return {Items: items, Count: count, CountAll: countAll};
            })            
        )
        .subscribe( data => {
            this.searchItems = data.Items;
            this.searchItemsCount = data.Count;
            this.searchQueryCount = data.CountAll;
        });
    }



    public onQuery(searchQuery: Array<SimpleQuery>) {
        this.sq.setQuery(searchQuery);
        //console.log('onQuery');
        this.loadMedias(this.sq);
    }

    public onPageChange(pageNumber: number) {
        this.sq.setPage(pageNumber);
        //console.log('onPageChange');
        this.loadMedias(this.sq);
    }

    public onSortChange(columns) {        
        this.sq.setSort(columns);
        //console.log('onSortChange');
        this.loadMedias(this.sq);
    }

    public pushQuery() {
        //this.finishQuery.emit({mode: this.mode, query: this.sq});

        switch(this.mode) {
            case this.config.ADD: { 
                this.addMedias(this.sq.Query);
                break; 
            }
            case this.config.DELETE: { 
                this.deleteMedias(this.sq.Query);
                break; 
            } 
        }
        //this.activeModal.close();
    }

    public addMedias(query: any) {
        this.loading = true;
        this.pathService.mediasAdd(this.authenticationService.sessionId, this.objectTypeId, this.objectId, query)
        .pipe( finalize( () => this.loading = false ) )
        .subscribe(
            data => {
                this.alertService.success('Ролики добавлены', 2000);
                this.activeModal.close();
                this.finishQuery.emit(true);
            }
        );
	}

    public deleteMedias(query: any) {
        this.loading = true;
        this.pathService.mediasRemove(this.authenticationService.sessionId, this.objectTypeId, this.objectId, query)
        .pipe( finalize( () => this.loading = false ) )
        .subscribe(
            data => {
                this.alertService.success('Ролики удалены', 2000);
                this.activeModal.close();
                this.finishQuery.emit(true);
            }
        );
	}
}