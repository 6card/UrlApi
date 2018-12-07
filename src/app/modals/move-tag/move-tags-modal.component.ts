
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MoveTagModal } from './move-tag-modal.component';

import { Subscription, forkJoin } from 'rxjs';
import { finalize, map, takeWhile } from 'rxjs/operators';

import { AuthenticationService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { PathService } from '../../services/path.service';
import { AlertService } from '../../services/alert.service';
import { MetaService } from '../../services/meta.service';
import { SortService } from '../../components/search-table/sort.service';

import { APP_CONST } from '../../config/const';

export class MoveTagsModal extends MoveTagModal{

    @Input() selectedIds: Array<number>;

    constructor(
        @Inject(APP_CONST) protected config,
        public activeModal: NgbActiveModal,
        protected metaService: MetaService,
        protected sortService: SortService, 
        protected searchService: SearchService,
        protected pathService: PathService,
        protected alertService: AlertService,
        protected authenticationService: AuthenticationService,
        
    ) {
        super(
            activeModal,
            metaService,
            sortService,
            searchService,
            pathService,
            alertService,
            authenticationService,
        )
    }

    public setObject(item: any, objectTypeId: number) {
        if(confirm(
            `Вы уверены что хотите перенести ролики из выбранных тегов в "${this.searchService.getSerachTypeName(objectTypeId)}: ${item.Name}"?`
        )) {
            const obj = {
                "Ids": this.selectedIds,
                "ObjectTypeId": objectTypeId,
                "ObjectId": item.Id
            };
           
            this.loading = true;
            this.pathService.moveAndDeleteManyTags(this.authenticationService.sessionId, obj)
            .pipe( finalize(() => this.loading = false) )
            .subscribe( _ => {
                this.alertService.success('Ролики перенесены', 2000, true);
                this.activeModal.close();
                this.finishQuery.emit(obj);
            });
            
        }

    }

}