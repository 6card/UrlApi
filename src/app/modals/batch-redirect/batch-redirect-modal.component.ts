import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { forkJoin } from 'rxjs';
import { finalize, takeWhile, map } from 'rxjs/operators';

import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';
import { SearchService } from '../../services/search.service';
import { AlertService } from '../../services/alert.service';
import { MetaService } from '../../services/meta.service';
import { SortService } from '../../components/search-table/sort.service';

import { SearchQuery, SimpleQuery, PageQuery } from '../../models/search-query.model';

@Component({
  selector: 'app-batch-redirect-modal',
  templateUrl: './batch-redirect-modal.component.html',
  providers: [ MetaService, SortService ]
})

export class BatchRedirectModalComponent implements OnInit, OnDestroy {

    private alive: boolean = true;
    public submitLoading: boolean = false;
    public searchResult: Array<any>;
    public searchItemsResult: number;

    public typeId: number = 0;
    public error: string = null;
    public sq = new SearchQuery();

    @Input() objectsFromRedirect: any;
    @Output() finishQuery = new EventEmitter();

    constructor(
        public activeModal: NgbActiveModal,
        private searchService: SearchService,
        private pathService: PathService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private metaService: MetaService,
        private sortService: SortService
    ) {}


    ngOnInit() {
        this.sortService.columnSorted$
        .pipe(takeWhile(() => this.alive))
        .subscribe(columns => {
            this.onSortChange(columns);
        });
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

    public isActive(id: number): boolean {
        return this.typeId === id;
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

    getResults() {
        this.submitLoading = true;

        forkJoin (
            this.searchService.search(this.typeId, this.authenticationService.sessionId, this.sq),
            this.searchService.searchCount(this.typeId, this.authenticationService.sessionId, this.sq.Query),
        )
        .pipe(
            finalize(() => this.submitLoading = false),
            map( ([items, count]) => {
                return {Items: items, Count: count};
            })
        )
        .subscribe( data => {
            this.searchResult = data.Items;
            this.searchItemsResult = data.Count;
        });

    }

    public setObject(item: any, objectTypeId: number) {
        let text: string;
        if (objectTypeId) {
            text = `Вы уверены назначить переадрессацию на "${this.searchService.getSerachTypeName(objectTypeId)}: ${item.Name}"?`;
        } else {
            text = `Вы уверены назначить переадрессацию на "${item}"?`;
        }

        if (confirm(text)) {
            const obj = {
                'SetPathIds': this.objectsFromRedirect.pathIds,
                'SetUrls': this.objectsFromRedirect.urls,
            };
            if (objectTypeId) {
                obj['ToPathId'] = item.PathId;
            } else {
                obj['ToUrl'] = item;
            }

            this.submitLoading = true;
            this.pathService.createManyRedirect(this.authenticationService.sessionId, obj)
            .pipe( finalize(() => this.submitLoading = false) )
            .subscribe( pathId => {
                this.alertService.success('Переадрессация выполнена', 2000, true);
                this.activeModal.close();
                this.finishQuery.emit(pathId);
            });

        }

    }

    public navigateToPath(obj: any) {
        if (typeof obj === 'string') {
            this.error = null;
            this.setObject(obj, 0);
        } else {
            this.error = null;
            this.setObject(obj, obj.ObjectTypeId);
        }
    }
}
