import { Component, OnInit } from '@angular/core';
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


@Component({
    selector: 'app-object',
    templateUrl: './object.component.html'
  })

export class ObjectComponent implements OnInit {
  item: ObjectBase;
  medias: Array<CheckedMedia>;

  totalMediasItems: number = 0;
  pageMediasSize: number = 10;
  currentMediasPage: number = 0;
 
    
    constructor(
        private pathService: PathService,
        private searchService: SearchService,
        private authenticationService: AuthenticationService,
        private activeRoute: ActivatedRoute,
        private alertService: AlertService,
        private modalService: NgbModal
    ) {}

    public updateCheckedMedias(media, event) {
      this.medias[this.medias.indexOf(media)].checked = event.target.checked;
    }

    public checkAllMedias(event){
        this.medias.map( i => i.checked = event.target.checked);
    }

    get checkedCheckboxAll() {
      if (!this.medias)
        return false;
      return this.medias.filter( i => i.checked == true).length == this.medias.length;
    }

    get checkedMediasIds() {
      if (!this.medias)
        return [];
      return this.medias.filter( i => i.checked == true).map( i => i.media.Id);
    }

    public deleteSelectedMedias() {
      /* TODO добавить удаление */
      this.alertService.success('ЗАГЛУШКА Ролики удалены', 2000);
      this.getMediasItem(this.item.ObjectTypeId, this.item.ObjectId);
    }

    public deleteAllMedias() {
      /* TODO добавить удаление */
      this.alertService.success('ЗАГЛУШКА Ролики удалены', 2000);
      this.getMediasItem(this.item.ObjectTypeId, this.item.ObjectId);
    }

    public pageChange(page: number) {    
      this.currentMediasPage = page - 1;
      this.getMediasItem(this.item.ObjectTypeId, this.item.ObjectId);    
    }
    
    public getMediasItem(typeid: number, id: number) {
      const query = [{
        Operation: 0,
        Tables: [ {Table: typeid, Values:[id]}]
      }];

      const data = {
        Query: query,
        Page: {
          Start: this.currentMediasPage * this.pageMediasSize + 1,        
          Length: this.pageMediasSize,        
          Sort: [        
            {        
              Column: 1,        
              Desc: true        
            }        
           ]        
          }
      };

      this.searchService.searchCount(3, this.authenticationService.sessionId, query) //Media
          .subscribe(data => {
            this.totalMediasItems = data;
          });

      
      this.searchService.search(3, this.authenticationService.sessionId, data) //Media
          .subscribe(data => {
            this.medias = data.map(item => new CheckedMedia(item));
          });
    }


    public loadItem(typeid: number, id: number) {
      this.pathService.getByObjectDetail(this.authenticationService.sessionId, typeid, id)
        .subscribe(
            (data: ObjectBase) => {
              this.item = data;
              //this.setValuesToForm(this.item);
              this.getMediasItem(this.item.ObjectTypeId, this.item.ObjectId);
              //console.log(this.item);
              //this.objectForm = this.toFormGroup(this.item);
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
    
    ngOnInit() {
      this.activeRoute.params.subscribe(routeParams => {
        this.loadItem(routeParams.typeid, routeParams.id);
      });        
    }

    /*
    setValuesToForm(item: ObjectBase) {      
      for (let key in item) {
        //console.log(key);
        let control = this.objectForm.get(key);
        if (!Array.isArray(item[key]) && control !== null )
        //if (control !== null)
          control.setValue(item[key]);
      }      
    }

    onSubmit() { 
      this.updateItem(this.objectForm.value);  
    }
    */

    openModal() {
      const modalRef = this.modalService.open(AddMediasModal, {size: 'lg', ariaLabelledBy: 'modal-add-medias'});
      modalRef.componentInstance.objectId = this.item.ObjectId;
      modalRef.componentInstance.selectMedias
        .subscribe(
          data => this.addMedias(data),
      );
    }

    public addMedias(medias: any) {
      console.log(medias);
    }


}