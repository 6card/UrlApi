import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-set-object',
    templateUrl: './set-object.component.html'
})

export class SetObjectComponent implements OnInit {

    pathId: number;

    constructor(
        private activatedRoute: ActivatedRoute,
    ) { }


    ngOnInit() {
        this.activatedRoute.params.subscribe(routeParams => {
            this.pathId = routeParams.id;
        });
    }

}
