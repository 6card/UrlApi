import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';

import { Tag } from '../../models/object-base';
import { finalize } from 'rxjs/operators';


@Component({
    selector: 'app-create-tag',
    templateUrl: './create-tag.component.html'
  })

export class CreateTagComponent implements OnInit { 

    tag: Tag;
    public createLoading: boolean = false;
    
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private pathService: PathService,
    ) {}
    
    ngOnInit() { }

    addProduct(tag: Tag) {
        let newTag = tag;

        this.createLoading = true;
        this.pathService.createTag(this.authenticationService.sessionId, newTag)
        .pipe ( finalize( () => this.createLoading = false ) )
        .subscribe( data => {
            this.router.navigate(['/object', 6, data]);
            
        });
    }
    
}