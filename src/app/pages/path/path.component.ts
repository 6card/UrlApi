import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SetObjectModal } from '../../modals/set-object/set-object-modal.component';
import { AddRedirectModal } from '../../modals/add-redirect/add-redirect-modal.component';

import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';
import { AlertService } from '../../services/alert.service';

import { Path } from '../../models/object-base';

@Component({
    selector: 'app-path',
    templateUrl: './path.component.html'
  })

export class EditPathComponent implements OnInit {
  item: Path;
  collapsePath: boolean = true;
  collapseObject: boolean = true;
  collapseRedirect: boolean = true;

  // @ViewChild("modal-content") modalContent: ElementRef;

    constructor(
        private pathService: PathService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private activeRoute: ActivatedRoute,
        private modalService: NgbModal
      ) {}

    public loadItem(id: number) {
      this.pathService.getByPathIdDetail(this.authenticationService.sessionId, id)
        .subscribe( (data: Path) => this.item = data );
    }

    public deleteObject () {
      this.pathService.deleteObject(this.authenticationService.sessionId, this.item.Id)
        .subscribe(
            data => {
              this.alertService.success('Объект удален', 2000);
              this.loadItem(this.item.Id);
            });
    }


    public openDialog() {
      const modalRef = this.modalService.open(SetObjectModal, {size: 'lg', ariaLabelledBy: 'modal-set-object', backdrop: 'static'});
      modalRef.componentInstance.currentItem = this.item;
      modalRef.componentInstance.selectObject
        .subscribe(
          data => this.setObject(data),
      );
    }

    public openRedirectDialog() {
      const modalRef = this.modalService.open(AddRedirectModal, {size: 'lg', ariaLabelledBy: 'modal-add-redirect', backdrop: 'static'});
      modalRef.componentInstance.item = this.item;
      modalRef.componentInstance.onSetRedirect
        .subscribe(
          data => {
            this.setObject(data);
          }
      );

    }

    public setObject(success: boolean) {
      if (success) {
        this.loadItem(this.item.Id);
      }
    }

    public isRedirect(): boolean {
      return this.item.ObjectTypeId === 11 ? true : false;
    }

    ngOnInit() {
        this.activeRoute.params.subscribe(routeParams => {
          this.loadItem(routeParams.id);
        });

    }
}
