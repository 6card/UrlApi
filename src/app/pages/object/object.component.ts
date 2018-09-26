import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';
import { SearchService } from '../../services/search.service';

import { ObjectBase } from '../../models/object-base';




@Component({
    selector: 'app-object',
    templateUrl: './object.component.html'
  })

export class ObjectComponent implements OnInit {
  item: ObjectBase;
  medias: Array<any>;

  totalMediasItems: number = 0;
  pageMediasSize: number = 10;
  currentMediasPage: number = 0;
  //objectForm: FormGroup;

  
  objectForm = new FormGroup({
      Id: new FormControl(''),
      GlobalId: new FormControl(''),
      ObjectId: new FormControl(''),
      ObjectTypeId: new FormControl(''),
      ObjectTypeName: new FormControl(''),
      Name: new FormControl(''),
      Description: new FormControl(''),
      SeoNoIndex: new FormControl(''),
      SeoEnable: new FormControl(''),
      SeoTitle: new FormControl(''),
      SeoDescription: new FormControl(''),
      SeoKeywords: new FormControl(''),      
      PathLatin: new FormControl(''),
      PathSuffix: new FormControl(''),
      ParentPathId: new FormControl(''),
      ParentPathLatin: new FormControl(''),
      ParentPathSuffix: new FormControl(''),
  });
  
    
    constructor(
        private pathService: PathService,
        private searchService: SearchService,
        private authenticationService: AuthenticationService,
        private activeRoute: ActivatedRoute
      ) {}

    public pageChange(page: number) {    
      this.currentMediasPage = page - 1;
      this.getMediasItem(this.item.ObjectTypeId, this.item.ObjectId);    
    }
    
    public getMediasItem(typeid: number, id: number) {
      const arr = [{
        Operation: 0,
        Tables: [ {Table: typeid, Values:[id]}]
      }];

      const data = {
        Query: arr,
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

      this.searchService.searchCount('Media', this.authenticationService.sessionId, arr)
          .subscribe(data => {
            this.totalMediasItems = data;
          });

      
      this.searchService.search('Media', this.authenticationService.sessionId, data)
          .subscribe(data => {
            this.medias = data;
          });
    }


    public loadItem(typeid: number, id: number) {
      this.pathService.getByObjectDetail(this.authenticationService.sessionId, typeid, id)
        .subscribe(
            (data: ObjectBase) => {
              this.item = data;
              this.setValuesToForm(this.item);
              this.getMediasItem(this.item.ObjectTypeId, this.item.ObjectId);
              //console.log(this.item);
              //this.objectForm = this.toFormGroup(this.item);
            });
    }

    public updateItem(item: ObjectBase) {
      this.pathService.updatePath(this.authenticationService.sessionId, item)
        .subscribe(
            data => {
              //this.setValuesToForm(data);
              //console.log(data);
              //this.objectForm = this.toFormGroup(this.item);
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
      /*
      if (this.objectForm.invalid) {
          return;
      }
      */

      this.updateItem(this.objectForm.value); 
 
    }


}