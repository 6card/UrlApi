import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';

import { filter, first } from 'rxjs/operators'

@Component({
    selector: 'app-set-object',
    templateUrl: './set-object.component.html'
})

export class SetObjectComponent implements OnInit {

    pathId: number;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private pathService: PathService,
        private authenticationService: AuthenticationService
    ) { }


    ngOnInit() {
        this.activatedRoute.params.subscribe(routeParams => {
            this.pathId = routeParams.id;
        });
    }

}