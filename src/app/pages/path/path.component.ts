import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';

import { finalize } from 'rxjs/operators';

//https://kamranahmed.info/blog/2018/02/28/dealing-with-route-params-in-angular-5/

@Component({
    selector: 'app-path',
    templateUrl: './path.component.html'
  })

export class EditPathComponent implements OnInit {
  item: any;
  openedDialog: boolean = false;
    
    constructor(
        private pathService: PathService,
        private authenticationService: AuthenticationService,
        private activeRoute: ActivatedRoute
      ) {}
    
    public loadItem(id: number) {
      this.pathService.getByPathIdDetail(this.authenticationService.sessionId, id)
        .subscribe(
            data => {
              this.item = data;
              //console.log(data);
            },
            error => {
                //console.log(error);
                //this.alertService.error(error);                
            },
            () => {
              //this.submitLoading = false;
            });

    }

    public deleteObject () {      
      this.pathService.deleteObject(this.authenticationService.sessionId, this.item.Id)
        .subscribe(
            data => {
              this.loadItem(this.item.Id);
            });    
    }

    public openDialog() {
      this.openedDialog = true;
    }

    ngOnInit() {
        this.activeRoute.params.subscribe(routeParams => {
          this.loadItem(routeParams.id);
        });
        
      }
}