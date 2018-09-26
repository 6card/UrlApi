import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FormGroup, FormControl, Validators} from "@angular/forms";

import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';
import { SearchService } from '../../services/search.service';

import { ObjectBase } from '../../models/object-base';


@Component({
    selector: 'app-create-tag',
    templateUrl: './create-tag.component.html'
  })

export class CreateTagComponent implements OnInit { 

    tag = new ObjectBase;
    
    constructor() {}
    
    ngOnInit() { }

    addProduct(tag: ObjectBase) {
        let newTag = new ObjectBase(tag);
        console.log(newTag);
    }
    
}