import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SetObjectModal } from '../../components/modals/set-object-modal.component';

import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';

import { finalize } from 'rxjs/operators';

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

    open() {
      const modalRef = this.modalService.open(SetObjectModal, {size: 'lg', ariaLabelledBy: 'modal-set-object'});
      modalRef.componentInstance.pathId = this.item.Id;
      modalRef.componentInstance.selectObject
        .subscribe(
          data => this.setObject(data),
      );
    }

    public setObject(obj: any) {
      console.log(obj);
      //this.modalService.dismissAll();
    }

    ngOnInit() {
        this.activeRoute.params.subscribe(routeParams => {
          this.loadItem(routeParams.id);
        });
        
      }
}