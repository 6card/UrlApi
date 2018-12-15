import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { forkJoin } from 'rxjs';
import { filter, finalize, takeWhile, map } from 'rxjs/operators';

import { AuthenticationService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { PathService } from '../../services/path.service';
import { MetaService } from '../../services/meta.service';
import { SortService } from '../../components/search-table/sort.service';

import { Path, Channel, Tag, Theme, Person, Section, Media, Serie }  from '../../models/object-base';
import { SearchQuery, SimpleQuery, PageQuery } from '../../models/search-query.model';

import { BatchRedirectModalComponent } from '../../modals/batch-redirect/batch-redirect-modal.component';

@Component({
  selector: 'app-batch-redirect',
  templateUrl: './batch-redirect.component.html',
  providers: [ MetaService, SortService ]
})
export class BatchRedirectComponent implements OnInit, OnDestroy {

    public typeId = 0;
    public submitLoading: boolean = false;
    public urlListLoading: boolean = false;
    public searchResult: Array<Channel | Media | Theme | Person | Tag | Section | Serie>;
    public searchItemsResult: number;
    public sq: SearchQuery;
    private alive: boolean = true;

    public selectedMediaUrls: Array<string>;
    public selectedMediaIds: Array<number>;
    public selectedMedias: Array<Path | string>;

    constructor(
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        protected searchService: SearchService,
        protected authenticationService: AuthenticationService,
        protected pathService: PathService,
        private metaService: MetaService,
        private sortService: SortService,
        private modalService: NgbModal,
    ) { }

    ngOnInit() {

        this.activatedRoute.queryParams
        .pipe(filter( param => param.q || param.p || param.typeId))
        .subscribe( (param: Params) => {
            this.metaService.loadMeta(Number(param.typeId));
            this.setSearchParams(
                Number(param.typeId),
                this.parseParam(param.q),
                this.parseParam(param.p),
                this.parseParam(param.sm),
                this.parseParam(param.smu)
            );
            this.getResults();
            this.getSelectedMedias();
        });

        this.sortService.columnSorted$
        .pipe(takeWhile(() => this.alive))
        .subscribe(columns => {
            this.onSortChange(columns);
        });

    }

    ngOnDestroy() {
        this.alive = false;
    }

    setSearchParams(t: number, q: Array<SimpleQuery>, p: PageQuery, sm: Array<number>, smu: Array<string>) {
        this.sq = new SearchQuery(q, p);
        this.selectedMediaIds = sm || [];
        this.selectedMediaUrls = smu || [];
        this.typeId = t;
        this.sortService.setInitSorted(this.sq.Page.Sort);
    }

    public onPageChange(pageNumber: number) {
        this.sq.setPage(pageNumber);
        this.navigate();
    }

    public onSortChange(columns) {
        this.sq.setSort(columns);
        this.navigate();
    }

    public onQuery(searchQuery: Array<SimpleQuery>) {
        this.sq.setQuery(searchQuery);
        this.navigate();
    }

    private parseParam(param: string) {
        if (typeof param === 'undefined') {
            return false;
        }
        return JSON.parse(decodeURIComponent(param));
    }

    public setType(id: number): void {
        this.typeId = id;
        const params = { typeId: this.typeId };
        if (this.selectedMediaIds.length) {
            params['sm'] = this.encodeUri(this.selectedMediaIds);
        }
        if (this.selectedMediaUrls.length) {
            params['smu'] = this.encodeUri(this.selectedMediaUrls);
        }
        this.navigate(false, params);
    }

    public isActive(id: number): boolean {
        return this.typeId === id;
    }

    private encodeUri(value: any): string {
        return encodeURIComponent(JSON.stringify(value));
    }

    public serialize(query, page, selm, selmu) {
        const q: string = this.encodeUri(query);
        const p: string = this.encodeUri(page);
        const sm: string = this.encodeUri(selm);
        const smu: string = this.encodeUri(selmu);
        return {q: q, p: p, sm: sm, smu: smu};
    }

    public navigate(replaceUrl?: boolean, params?: any) {
        const prm = { typeId: this.typeId };
        const srl = this.serialize(this.sq.Query, this.sq.Page, this.selectedMediaIds, this.selectedMediaUrls);
        if (this.typeId) {
            prm['q'] = srl.q;
            prm['p'] = srl.p;
        }
        if (this.selectedMediaIds.length) {
            prm['sm'] = srl.sm;
        }
        if (this.selectedMediaUrls.length) {
            prm['smu'] = srl.smu;
        }

        this.router.navigate([], { replaceUrl: replaceUrl || false, queryParams: params ? params : prm });
    }

    getResults() {
        if (!this.typeId) {
            return;
        }
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

    public containInMediaIds(id: number): boolean {
        if (this.selectedMediaIds.indexOf(id) !== -1) {
            return true;
        }
        return false;
    }

    public selectMedia(id: number) {
        if (!this.containInMediaIds(id)) {
            this.selectedMediaIds.push(id);
        }

        this.navigate(true);
    }

    public deleteMediaItem(item: any) {
        if (typeof item === 'string') {
            this.selectedMediaUrls.splice(this.selectedMediaUrls.indexOf(item), 1);
        } else {
            this.selectedMediaIds.splice(this.selectedMediaIds.indexOf(item), 1);
        }
        this.navigate(true);
    }


    public getSelectedMedias() {
        this.urlListLoading = true;
        const query: SimpleQuery = {
            Operation: 0, Columns: [ { Column: 1, Operation: 9, Value: this.selectedMediaIds}], Tables: [ ]
        };
        const pathSearchQuery = new SearchQuery([query]);

        this.searchService.search(11, this.authenticationService.sessionId, pathSearchQuery.queryWithoutPage)
        .pipe(
            finalize(() => this.urlListLoading = false),
        )
        .subscribe( data => {
            this.selectedMedias = data;
        });
    }

    get resultSelectedArray() {
        return this.selectedMedias.concat(this.selectedMediaUrls);
    }

    public addToMedias($event) {
        if ($event) {
            if (typeof $event === 'string') {
                if (!this.selectedMediaUrls.find( i => i === $event)) {
                    this.selectedMediaUrls.push($event);
                }
                this.navigate(true);
            } else {
                this.selectMedia($event.PathId);
            }
        }

    }

    public openRedirectModal() {
        const modalRef = this.modalService.open(
            BatchRedirectModalComponent, {size: 'lg', ariaLabelledBy: 'modal-batch-redirect', backdrop: 'static'}
        );
        modalRef.componentInstance.objectsFromRedirect = {pathIds: this.selectedMediaIds, urls: this.selectedMediaUrls};
        modalRef.componentInstance.finishQuery
            .subscribe( pathId => this.router.navigate(['/path', pathId]));
    }

}
