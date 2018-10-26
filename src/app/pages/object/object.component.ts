import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddMediasModal } from '../../components/modals/add-medias-modal.component';

import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';
import { SearchService } from '../../services/search.service';
import { AlertService } from '../../services/alert.service';

import { ObjectBase } from '../../models/object-base';
import { CheckedMedia } from '../../models/media';
import { SearchQuery, SimpleQuery } from '../../models/search-query.model';

import { APP_CONST } from '../../config/const';

@Component({
    selector: 'app-object',
    templateUrl: './object.component.html'
  })

export class ObjectComponent implements OnInit {
  
	public item: ObjectBase;
	public searchMediasQuery: SearchQuery;
	public searchMedias: Array<CheckedMedia>;
	public searchMediasCount: number;
    
    constructor(
        @Inject(APP_CONST) private config,
        private pathService: PathService,
        private searchService: SearchService,
        private authenticationService: AuthenticationService,
        private activeRoute: ActivatedRoute,
        private alertService: AlertService,
        private modalService: NgbModal
    ) {}

    ngOnInit() {
      this.activeRoute.params.subscribe(routeParams => {
        this.loadItem(routeParams.typeid, routeParams.id);
      });        
    }

    public updateCheckedMedias(media, event) {
      this.searchMedias[this.searchMedias.indexOf(media)].checked = event.target.checked;
    }

    public checkAllMedias(event){
        this.searchMedias.map( i => i.checked = event.target.checked);
    }

    get checkedCheckboxAll() {
      if (!this.searchMedias)
        return false;
      return this.searchMedias.filter( i => i.checked == true).length == this.searchMedias.length;
    }

    get checkedMediasIds() {
      if (!this.searchMedias)
        return [];
      return this.searchMedias.filter( i => i.checked == true).map( i => i.media.Id);
    }

    public deleteSelectedMedias() {
      /* TODO добавить удаление */
      this.alertService.success('ЗАГЛУШКА Ролики удалены', 2000);
      this.getMediasItem();
    }

    public deleteAllMedias() {
      /* TODO добавить удаление */
      this.alertService.success('ЗАГЛУШКА Ролики удалены', 2000);
      this.getMediasItem();
    }

    public pageChange(page: number) {    
      this.searchMediasQuery.setPage(page);
      this.getMediasItem();    
    }
    
    public getMediasItem() {
      this.searchService.searchCount(3, this.authenticationService.sessionId, this.searchMediasQuery.Query) //Media
          .subscribe(data => {
            this.searchMediasCount = data;
      });
      this.searchService.search(3, this.authenticationService.sessionId, this.searchMediasQuery) //Media
          .subscribe(data => {
            this.searchMedias = data.map(item => new CheckedMedia(item));
      });
    }

    public loadItem(typeid: number, id: number) {
      this.pathService.getByObjectDetail(this.authenticationService.sessionId, typeid, id)
        .subscribe(
            (data: ObjectBase) => {
              this.item = data;
              let query: SimpleQuery = { Operation: 0, Columns: [], Tables: [ {Table: this.item.ObjectTypeId, Values:[this.item.ObjectId]}] };
              this.searchMediasQuery = new SearchQuery([query]);
              this.getMediasItem();
            });
    }

    public updateItem(obj: ObjectBase) {
      const item = Object.assign(this.item, obj);
      this.pathService.updatePath(this.authenticationService.sessionId, item)
        .subscribe(
            data => {
              this.alertService.success('Данные сохранены', 2000);
        });
    }

    toFormGroup(item: ObjectBase ) {
      let group: any = {};

      for (let key in item) {
        group[key] = new FormControl(item[key] || '')
      }

      return new FormGroup(group);
    }

    openModal(mode) {
		const modalRef = this.modalService.open(AddMediasModal, {size: 'lg', ariaLabelledBy: 'modal-add-medias', backdrop: 'static'});
		modalRef.componentInstance.mode = mode;
		modalRef.componentInstance.objectSq = [ {Table: this.item.ObjectTypeId, Values:[this.item.ObjectId]}];
		modalRef.componentInstance.selectedQuery
		.subscribe(
			data => {
				switch(data.mode) {
					case this.config.ADD: { 
						this.addMedias(data.query);
						break; 
					}
					case this.config.DELETE: { 
						this.deleteMedias(data.query);
						break; 
					} 
				}
			}
		);
	}
	
	public addMedias(query: any) {
		console.log('add medias query', query);
	}

    public deleteMedias(query: any) {
      	console.log(query);
	}
	
}