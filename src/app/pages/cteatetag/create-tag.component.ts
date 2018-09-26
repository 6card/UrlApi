import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';

import { ObjectBase } from '../../models/object-base';


@Component({
    selector: 'app-create-tag',
    templateUrl: './create-tag.component.html'
  })

export class CreateTagComponent implements OnInit { 

    tag = new ObjectBase;
    
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private pathService: PathService,
    ) {}
    
    ngOnInit() { }

    addProduct(tag: ObjectBase) {
        let newTag = new ObjectBase(tag);
        this.pathService.createTag(this.authenticationService.sessionId, newTag)
        .subscribe( data => {
            this.router.navigate(['/object', 6, data]);
            
        });
    }
    
}