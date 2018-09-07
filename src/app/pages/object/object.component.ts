import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FormGroup, FormControl, Validators} from "@angular/forms";

import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';

import { ObjectBase } from '../../models/object-base';

import { first } from 'rxjs/operators';


@Component({
    selector: 'app-object',
    templateUrl: './object.component.html'
  })

export class ObjectComponent implements OnInit {
  item: ObjectBase;
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
      SeoStatusId: new FormControl(''),
      //SeoTitle: new FormControl(''),
      //SeoDescription: new FormControl(''),
      //SeoKeywords: new FormControl(''),
      ParentPathId: new FormControl(''),
      PathLatin: new FormControl(''),
      PathSuffix: new FormControl(''),
      ParentPathLatin: new FormControl(''),
      ParentPathSuffix: new FormControl(''),
  });
  
    
    constructor(
        private pathService: PathService,
        private authenticationService: AuthenticationService,
        private activeRoute: ActivatedRoute
      ) {}
    
    public loadItem(typeid: number, id: number) {
      this.pathService.getByObjectDetail(this.authenticationService.sessionId, typeid, id)
        .subscribe(
            (data: ObjectBase) => {
              this.item = data;
              this.setValuesToForm(this.item);
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