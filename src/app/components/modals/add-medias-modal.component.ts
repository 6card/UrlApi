import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { MetaService } from '../../services/meta.service';

import { CheckedMedia } from '../../models/media';

import { START_SQ, START_SS, START_SP } from '../../components/common-search/common-search.component';

@Component({
  selector: 'add-medias-modal',
  templateUrl: './add-medias-modal.component.html',
  providers: [ MetaService ]
})
export class AddMediasModal implements AfterViewInit {

    medias: Array<CheckedMedia>;
    searchResult: Array<any>;
    searchItemsResult: number = 0;
    searchQuery: any = START_SQ;
    searchPage: any = START_SP;

  @Input() objectId;
  @Output() selectMedias = new EventEmitter();

  constructor(
        private activeModal: NgbActiveModal,
        private metaService: MetaService,
        private searchService: SearchService,
        private authenticationService: AuthenticationService,
    ) {}

  ngAfterViewInit() {
    this.metaService.loadMeta(3);
    this.loadMedias();
  }

  public loadMedias() {

    this.searchService.search(3, this.authenticationService.sessionId, {Query: this.searchQuery, Page: this.searchPage})
        .pipe(
            //finalize(() => this.submitLoading = false)
        )
        .subscribe(
            data => {
                this.searchResult = data; 
            },
            error => {},
            //() => {this.submitLoading = false}
        );

        this.searchService.searchCount(3, this.authenticationService.sessionId, this.searchQuery)
        .pipe(
            //finalize(() => this.submitLoading = false)
        )
        .subscribe(
            data => { this.searchItemsResult = data; },
            error => { },
            //() => {this.submitLoading = false}
        );

  }

    public onQuery(searchQuery) {
        this.searchQuery = searchQuery;
        this.loadMedias();
    }

    public onPageChange(pageNumber: number) {
        const page = {
            Start: (pageNumber - 1) * 10 + 1,        
            Length: 10,        
            Sort: START_SS     
        };

        this.searchPage = page;
        this.loadMedias();
        //this.navigate();
    }

    public onSortChange(columns) {
        
        if (columns.length == 0) columns = START_SS;

        const page = {
            Start: 1,        
            Length: 10,        
            Sort: columns      
        };


        this.searchPage = page;
        this.loadMedias();
        //this.navigate();
    }

    get page(): number {
        if (typeof this.searchPage === "undefined") return 1;
        return (this.searchPage.Start - 1) / 10 + 1 || 1;
    }

  public setObject(obj: any) {
    this.selectMedias.emit(obj);
    this.activeModal.close();
  }
}