import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MoveTagsModal } from '../../components/modals/move-tags-modal.component';

import { MetaService } from '../../services/meta.service';
import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';
import { SearchService } from '../../services/search.service';
import { AlertService } from '../../services/alert.service';

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
    ) { }

    ngOnInit() {
        //this.metaService.loadMeta(6);
    }

    onChangeTagsIds(ids: string) {
        console.log(this.tagIds);
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

    public deleteTags() {
        if(confirm(
          `Вы уверены что хотите удалить выбранные теги?`
        )) {
          this.deleteLoading = true;
          this.pathService.deleteManyTags(this.authenticationService.sessionId, this._tagIds)
          .pipe ( finalize(() => this.deleteLoading = false) )
          .subscribe(
                data => {
                  this.alertService.success('Теги удалены', 2000, true);
                  this.router.navigate(['/']);
            });        
        }
      }

    public openMoveModal() {
        const modalRef = this.modalService.open(MoveTagsModal, {size: 'lg', ariaLabelledBy: 'modal-move-tag', backdrop: 'static'});
        modalRef.componentInstance.selectedIds = this._tagIds;
        modalRef.componentInstance.finishQuery
          .subscribe( obj => this.router.navigate(['/object', obj.ObjectTypeId, obj.ObjectId]));
    }


}