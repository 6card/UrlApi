import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
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
    public searchItemsCount: number = 0;
    public loading: boolean = false;
    public sq = new SearchQuery();

    //dialogMediaAction: DialogMediaAction;

    @Input() objectSq: SearchQuery;
    @Input() mode;
    @Output() selectedQuery = new EventEmitter();

    private _columnSortedSubscription: Subscription;    

    constructor(
        @Inject(APP_CONST) private config,
        private activeModal: NgbActiveModal,
        private metaService: MetaService,
        private sortService: SortService, 
        private searchService: SearchService,
        private authenticationService: AuthenticationService,
    ) {}

    ngOnInit() {        
        this.metaService.loadMeta(3);
        //console.log('ngOnInit');
        //this.loadMedias(this.sq);
        this._columnSortedSubscription = this.sortService.columnSorted$.subscribe(columns => {
            this.onSortChange(columns);
        });
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

        this.searchService.search(3, this.authenticationService.sessionId, search)
            .pipe( finalize(() => this.loading = false))
            .subscribe( data => this.searchItems = data );

        this.searchService.searchCount(3, this.authenticationService.sessionId, search.Query)
            .pipe()
            .subscribe( data => this.searchItemsCount = data );
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
        this.selectedQuery.emit({mode: this.mode, query: this.sq});
        this.activeModal.close();
    }
}