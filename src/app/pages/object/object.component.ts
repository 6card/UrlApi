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
  objectForm: FormGroup;

  /*
  objectForm = new FormGroup({
      ObjectId: new FormControl('', Validators.required),
      ObjectTypeId: new FormControl('', Validators.required),
      Name: new FormControl('', Validators.required),
      Description: new FormControl('', Validators.required),
      SeoNoIndex: new FormControl('', Validators.required),
      SeoStatusId: new FormControl('', Validators.required),
      SeoTitle: new FormControl('', Validators.required),
      SeoDescription: new FormControl('', Validators.required),
      SeoKeywords: new FormControl('', Validators.required),
      PathParentId: new FormControl('', Validators.required),
      PathLatin: new FormControl('', Validators.required),
      PathId: new FormControl('', Validators.required),
  });
  */
    
    constructor(
        private pathService: PathService,
        private authenticationService: AuthenticationService,
        private activeRoute: ActivatedRoute
      ) {}
    
    public loadItem(typeid: number, id: number) {
      this.pathService.getByObjectDetail(this.authenticationService.sessionId, typeid, id)
        .pipe(first())
        .subscribe(
            data => {
              this.item = new ObjectBase(data);
              console.log(this.item);
              this.objectForm = this.toFormGroup(this.item);
            },
            error => {
                console.log(error);              
            });
    }

    toFormGroup(item: ObjectBase ) {
      let group: any = {};

      for (let key in item) {
        group[key] = new FormControl(item[key] || '', Validators.required)
      }

      return new FormGroup(group);
    }
    
    ngOnInit() {
      this.activeRoute.params.subscribe(routeParams => {
        this.loadItem(routeParams.typeid, routeParams.id);
      });        
    }
}