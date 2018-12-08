import { Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter, Input, HostListener, ElementRef } from '@angular/core';

import { TagItem } from './autocomplete.component';

@Component({
    selector: 'autocomplete-window',
    exportAs: 'AutocompleteWindowComponent',
    host: {'class': 'dropdown-menu show', 'style': 'max-height: 300px; overflow-y: scroll;'},
    template: `
    <div class="loader loader-20" *ngIf="loading"></div>
    <div *ngIf="searchResults && searchResults.length == 0">Нет результатов</div>
    <button type="button" class="dropdown-item" *ngFor="let item of searchResults; let i = index"
        (click)="select(item)"
        [id]="'aid-' + i"
        [class.active]="i === activeIdx"
        (mouseenter)="markActive(i)"
    >{{item.title}}</button>
    `
})

export class AutocompleteWindowComponent implements OnInit, OnDestroy, AfterViewInit {

    activeIdx = 0;
    @Input() loading: boolean;
    @Input() searchResults: Array<TagItem>;
    @Input() focusFirst = false;

    @Output() selectEvent = new EventEmitter();

    @Output() clickOutside = new EventEmitter();

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit(targetElement);
        }
    }

    constructor (private _elementRef: ElementRef) {}

    get element() {
      return this._elementRef;
    }

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
        this.scrollToElement();
    }

    selectPrev() {
        if (this.activeIdx < 0) {
          this.activeIdx = this.searchResults.length - 1;
        } else if (this.activeIdx === 0) {
          this.activeIdx = this.focusFirst ? this.searchResults.length - 1 : -1;
        } else {
          this.activeIdx--;
        }
        this.scrollToElement(true);
    }

    scrollToElement(top: boolean = false) {
      let notVisible = false;
      const button = this.selectedElement;
      if (!button) {
        return;
      }

      if (button.offsetTop + button.offsetHeight > this.element.nativeElement.scrollTop + this.element.nativeElement.offsetHeight || button.offsetTop < this.element.nativeElement.scrollTop) {
        notVisible = true;
      }

      if (top) { // scroll to top
        if (this.element.nativeElement.scrollTop + button.offsetHeight > button.offsetTop || notVisible) {
          this.element.nativeElement.scrollTo(0, button.offsetTop - button.offsetHeight);
        }
      } else { // scroll to bottom
        if ( (this.element.nativeElement.offsetHeight + this.element.nativeElement.scrollTop ) <= button.offsetTop + button.offsetHeight + 10  || notVisible ) {
          this.element.nativeElement.scrollTo(0, button.offsetTop + button.offsetHeight * 2 - this.element.nativeElement.offsetHeight);
        }
      }
    }

    get selectedElement(): HTMLElement {
      const el = document.getElementById(`aid-${this.activeIdx}`);
      return el ? el : null;
    }

    ngOnInit() { this.resetActive(); }

    ngAfterViewInit() { }

    ngOnDestroy() { }

}
