import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { DtpickerComponent } from '../components/dtpicker/dtpicker.component';

@Component({
    selector: 'test',
    template: `
        <input type="text" #dtinput (click)="open()" value="28.01.2018 15:40" />
        <div style="position: relative;">
            <template #dtpicker></template>
        </div>  
    `
})

export class TestComponent {
    componentRef;
    private _closed$ = new Subject();

    @ViewChild("dtpicker", { read: ViewContainerRef }) container: ViewContainerRef;
    @ViewChild("dtinput") dtinput;

    constructor(
        private _resolver: ComponentFactoryResolver,
        private _renderer: Renderer2,
        @Inject(DOCUMENT) private _document: any
    ) { }

    private _applyStyling(nativeElement: any) {
        this._renderer.addClass(nativeElement, 'dropdown-menu');
        this._renderer.setStyle(nativeElement, 'padding', '0');
        this._renderer.addClass(nativeElement, 'show');
    }

    isOpen() { return !!this.componentRef; }

    open() {        
        this.container.clear(); 
        const factory = this._resolver.resolveComponentFactory(DtpickerComponent);
        this.componentRef = this.container.createComponent(factory);
        this._applyStyling(this.componentRef.location.nativeElement);

        this.componentRef.instance.datetime = this.dtinput.nativeElement.value;
        this.componentRef.instance.ngOnInit();

        this.componentRef.instance.change.subscribe(
            dt => this.dtinput.nativeElement.value = dt
        );

        this.componentRef.instance.clickOutside.subscribe(
            cls => {if (cls) this.close() }
        );

        let isOpening = true;
        requestAnimationFrame(() => isOpening = false);
        let outsideClicks$ = fromEvent<MouseEvent>(this._document, 'click')
                                 .pipe(
                                    takeUntil(this._closed$),
                                    filter(event => !isOpening && !this.componentRef.location.nativeElement.contains(event.target))
                                  )
                                  .subscribe(() => this.close());
    }    

    close() {        
        this.container.remove(this.container.indexOf(this.componentRef.hostView));
        this.componentRef = null;
        this._closed$.next();
    }

    toggle() {
        if (this.isOpen()) {
          this.close();
        } else {
          this.open();
        }
    }
}