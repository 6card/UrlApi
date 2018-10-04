import { Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter, Input, ViewChild, ElementRef, HostBinding } from "@angular/core";

@Component({
    selector: "autocomplete-window",
    exportAs: 'AutocompleteWindowComponent',
    host: {'class': 'dropdown-menu show', 'style': 'left: 14px;'},
    template: `
    <div *ngIf="searchResults && searchResults.length == 0">Нет результатов</div>
    <button type="button" class="dropdown-item" *ngFor="let item of searchResults; let i = index"
        (click)="select(item)"
        [id]="id + '-' + i"
        [class.active]="i === activeIdx"
        (mouseenter)="markActive(i)"
    >{{item.title}}</button>
    `
})

export class AutocompleteWindowComponent implements OnInit, OnDestroy, AfterViewInit {

    activeIdx = 0;

    @Input() searchResults: Array<any>;
    @Input() focusFirst = false;

    @Output() selectEvent = new EventEmitter();

    select(item) { this.selectEvent.emit(item); }

    resetActive() { this.activeIdx = this.focusFirst ? 0 : -1; }

    markActive(activeIdx: number) { this.activeIdx = activeIdx; }
    getActive() { return this.searchResults[this.activeIdx]; }

    selectNext() {
        if (this.activeIdx === this.searchResults.length - 1) {
          this.activeIdx = this.focusFirst ? (this.activeIdx + 1) % this.searchResults.length : -1;
        } else {
          this.activeIdx++;
        }
      }
    
    selectPrev() {
        if (this.activeIdx < 0) {
          this.activeIdx = this.searchResults.length - 1;
        } else if (this.activeIdx === 0) {
          this.activeIdx = this.focusFirst ? this.searchResults.length - 1 : -1;
        } else {
          this.activeIdx--;
        }
    }

    

    ngOnInit() { }

    ngAfterViewInit() { }

    ngOnDestroy() { }

}