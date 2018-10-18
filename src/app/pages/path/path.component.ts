import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

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
  collapsePath: boolean = true;
  collapseObject: boolean = true;
  collapseRedirect: boolean = true;
  
  //@ViewChild("modal-content") modalContent: ElementRef;
    
    constructor(
        private pathService: PathService,
        private authenticationService: AuthenticationService,
        private activeRoute: ActivatedRoute,
        private modalService: NgbModal
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

    public openDialog(content) {
      this.modalService.open(content, {size: 'lg', ariaLabelledBy: 'modal-set-object'});
    }

    ngOnInit() {
        this.activeRoute.params.subscribe(routeParams => {
          this.loadItem(routeParams.id);
        });
        
      }
}