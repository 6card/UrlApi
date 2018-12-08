import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MoveTagsModalComponent } from '../../modals/move-tag/move-tags-modal.component';

import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';
import { SearchService } from '../../services/search.service';
import { AlertService } from '../../services/alert.service';

import { SearchQuery, SimpleQuery } from '../../models/search-query.model';

import { forkJoin } from 'rxjs';
import { finalize, map, filter } from 'rxjs/operators';


@Component({
    selector: 'app-move-tags',
    templateUrl: './move-tags.component.html',
    // providers: [ MetaService ]
})

export class MoveTagsComponent implements OnInit {

    public tagIds: string;
    public searchMedias: Array<any>;
    public searchMediasCount: number;
    public searchMediasQuery: SearchQuery;
    public loading: boolean = false;
    public deleteLoading: boolean = false;

    /*
    selectTagsForm: FormGroup = this.formBuilder.group({
        items: this.formBuilder.array([])
    });
    */

    constructor(
        private pathService: PathService,
        private searchService: SearchService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private modalService: NgbModal,
        private router: Router,
        protected activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        // this.metaService.loadMeta(6);
        this.activatedRoute.queryParams
        .pipe(filter( param => param.tagIds ))
        .subscribe( (param: Params) => {
            this.tagIds = this.parseParam(param.tagIds);
            const query: SimpleQuery = { Operation: 0, Columns: [], Tables: [ {Table: 6, Values: this.numberTagIds}] };
            this.searchMediasQuery = new SearchQuery([query]);
            this.getMediasItem();
        });
    }

    private parseParam(param: string) {
        if (typeof param === 'undefined') {
            return false;
        }
        return JSON.parse(decodeURIComponent(param));
    }

    onChangeTagsIds(ids: string) {
        this.navigate(true);
    }

    get numberTagIds(): Array<number> {
        return this.tagIds.split(', ').map(i => Number(i));
    }

    /*
    onChangeTagsIds(ids: string) {
        this._tagIds = ids.split(', ').map( i => Number(i));
        let query: SimpleQuery = { Operation: 0, Columns: [], Tables: [ {Table: 6, Values: this._tagIds}] };
        this.searchMediasQuery = new SearchQuery([query]);
        this.getMediasItem();
    }
    */


    public pageChange(page: number) {
        this.searchMediasQuery.setPage(page);
        this.getMediasItem();
    }

    public getMediasItem() {

        this.loading = true;

        forkJoin (
            this.searchService.search(3, this.authenticationService.sessionId, this.searchMediasQuery),
            this.searchService.searchCount(3, this.authenticationService.sessionId, this.searchMediasQuery.Query),
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

    public deleteTags() {
        if (confirm(
          `Вы уверены что хотите удалить выбранные теги?`
        )) {
          this.deleteLoading = true;
          this.pathService.deleteManyTags(this.authenticationService.sessionId, this.numberTagIds)
          .pipe ( finalize(() => this.deleteLoading = false) )
          .subscribe(
                data => {
                  this.alertService.success('Теги удалены', 2000, true);
                  this.router.navigate(['/']);
            });
        }
      }

    public openMoveModal() {
        const modalRef = this.modalService.open(MoveTagsModalComponent, {size: 'lg', ariaLabelledBy: 'modal-move-tag', backdrop: 'static'});
        modalRef.componentInstance.selectedIds = this.numberTagIds;
        modalRef.componentInstance.finishQuery
          .subscribe( obj => this.router.navigate(['/object', obj.ObjectTypeId, obj.ObjectId]));
    }

    public navigate(replaceUrl?: boolean) {
        if (this.tagIds) {
            const params = { tagIds: encodeURIComponent(JSON.stringify(this.tagIds)) };
            this.router.navigate([], { replaceUrl: replaceUrl || false, queryParams: params});
        } else {
            this.router.navigate([], { replaceUrl: replaceUrl || false});
        }
    }


}
