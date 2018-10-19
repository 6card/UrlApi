import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'set-object-modal',
  template: `
      <div class="modal-header">
        <h4 id="modal-set-object">Выберите объект</h4>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
            <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <app-search [pathId]="pathId" (selectObject)="setObject($event)"></app-search>
      </div>
  `
})
export class SetObjectModal {
  @Input() pathId;
  @Output() selectObject = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) {}

  public setObject(obj: any) {
    this.selectObject.emit(obj);
    this.activeModal.close();
  }
}