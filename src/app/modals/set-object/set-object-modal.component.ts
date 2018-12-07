import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { forkJoin } from 'rxjs';
import { finalize, takeWhile, map } from 'rxjs/operators'

import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';
import { SearchService } from '../../services/search.service';
import { AlertService } from '../../services/alert.service';
import { MetaService } from '../../services/meta.service';
import { SortService } from '../../components/search-table/sort.service';

import { SearchQuery, SimpleQuery, PageQuery } from '../../models/search-query.model';

@Component({
  selector: 'set-object-modal',
  templateUrl: './set-object-modal.component.html',
  providers: [ MetaService, SortService ]
})

export class SetObjectModal implements OnInit, OnDestroy {

    private alive: boolean = true;
    public submitLoading: boolean = false;
    public searchResult: Array<any>;
    public searchItemsResult: number;

    public typeId: number = 0;
    public error: string = null;
    public sq = new SearchQuery();

    @Input() currentItem;
    @Output() selectObject = new EventEmitter();

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

    public isActive(id: number): boolean{
        return this.typeId == id;
    }

    public onQuery(searchQuery: Array<SimpleQuery>) {
        //console.log('onQuery');     
        this.sq.setQuery(searchQuery);
        this.getResults();
    }

    public onPageChange(pageNumber: number) {
        //console.log('onPageChange');
        this.sq.setPage(pageNumber);
        this.getResults();
    }

    public onSortChange(columns) {   
        //console.log('onSortChange');     
        this.sq.setSort(columns);
        this.getResults();
    }

    getResults() {
        this.submitLoading = true;

        forkJoin (
            this.searchService.search(this.typeId, this.authenticationService.sessionId, this.sq),
            this.searchService.searchCount(this.typeId,this.authenticationService.sessionId, this.sq.Query),
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
        if(confirm(
            `Вы уверены что хотите заменить объект "${this.currentItem.ObjectTypeName}: ${this.currentItem.Name}" на "${this.searchService.getSerachTypeName(objectTypeId)}: ${item.Name}"?`
        )) {
            const obj = {
                "ObjectTypeId": objectTypeId,
                "ObjectId": item.Id
            };
    
            this.submitLoading = true;
            this.pathService.setObject(this.authenticationService.sessionId, this.currentItem.pathId, obj)
            .pipe( finalize(() => this.submitLoading = false) )
            .subscribe( _ => {
                this.alertService.success('Объект выставлен', 2000);
                this.activeModal.close();
                this.selectObject.emit(true);
            });
        }

    }

    public navigateToPath(obj: any | boolean) {
        if (!obj) {
            this.error = "Путь не найден";
            return;
        } else {
            this.error = null;
            this.setObject(obj, obj.ObjectTypeId)
        }
    }
}