import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { MetaService } from '../../services/meta.service';
import { SortService } from '../../components/search-table/sort.service';

import { CheckedMedia } from '../../models/media';

import { START_SQ, START_SS, START_SP } from '../../components/common-search/common-search.component';

@Component({
  selector: 'add-medias-modal',
  templateUrl: './add-medias-modal.component.html',
  providers: [ MetaService, SortService ]
})
export class AddMediasModal implements OnInit, OnDestroy, AfterViewInit {

    public medias: Array<CheckedMedia>;
    public searchResult: Array<any>;
    public searchItemsResult: number = 0;
    public searchQuery: any = START_SQ;
    public searchPage: any = START_SP;
    public loading: boolean = true;

    @Input() objectId;
    @Output() selectMedias = new EventEmitter();

    private columnSortedSubscription: Subscription;

    constructor(
        private activeModal: NgbActiveModal,
        private metaService: MetaService,
        private sortService: SortService, 
        private searchService: SearchService,
        private authenticationService: AuthenticationService,
    ) {}

    ngOnInit() {
        this.metaService.loadMeta(3);
        console.log('ngAfterViewInit');
        this.loadMedias();

        this.columnSortedSubscription = this.sortService.columnSorted$.subscribe(columns => {
            //console.log(columns);
            this.onSortChange(columns);
        });

    }

    ngOnDestroy() {
        this.columnSortedSubscription.unsubscribe();
    }

    ngAfterViewInit() { }

  public loadMedias() {
    this.loading = true;

    this.searchService.search(3, this.authenticationService.sessionId, {Query: this.searchQuery, Page: this.searchPage})
        .pipe( finalize(() => this.loading = false))
        .subscribe( data => this.searchResult = data );

    this.searchService.searchCount(3, this.authenticationService.sessionId, this.searchQuery)
        .pipe()
        .subscribe( data => this.searchItemsResult = data );

  }

    public onQuery(searchQuery) {
        this.searchQuery = searchQuery;
        console.log('onQuery');
        //this.loadMedias();
        this.onPageChange(1);
    }

    public onPageChange(pageNumber: number) {
        this.searchPage = {
            Start: (pageNumber - 1) * 10 + 1,        
            Length: 10,        
            Sort: START_SS     
        };
        console.log('onPageChange');
        this.loadMedias();
    }

    public onSortChange(columns) {        
        if (columns.length == 0) columns = START_SS;
        this.searchPage = {
            Start: 1,        
            Length: 10,        
            Sort: columns      
        };
        console.log('onSortChange');
        this.loadMedias();
    }

    get currentPage(): number {
        if (typeof this.searchPage === "undefined") return 1;
        return (this.searchPage.Start - 1) / 10 + 1 || 1;
    }

    public setObject(obj: any) {
        this.selectMedias.emit(obj);
        this.activeModal.close();
    }

    getDirection(columnId: number) {
        if (!this.searchPage)
            return '';
        const sortCoulumn = this.searchPage.Sort.find( s => s.Column == columnId);
        if (sortCoulumn)
            return sortCoulumn.Desc ? 'desc' : 'asc';
        else
            return '';
    }
}