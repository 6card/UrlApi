import { Component, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Renderer2, Inject, ComponentRef, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

import * as moment from 'moment';

import { DtpickerWindowComponent } from './dtpicker-window.component';

@Component({
    selector: 'dtpicker',
    template: `
        <div style="position: relative;">
            <input class="form-control" type="text" #dtinput (click)="toggle()" (blur)="setValidateValue($event.target)" (keyup)="handleKeyboard($event)" />        
            <ng-template #dtpw></ng-template>
        </div>  
    `,
    providers: [
        { 
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => DtpickerComponent),
          multi: true
        }
    ]
})

export class DtpickerComponent implements ControlValueAccessor {
    private _componentRef: ComponentRef<DtpickerWindowComponent>;

    @Input() dtTemplate: string = 'DD.MM.YYYY HH:mm';

    @ViewChild("dtpw", { read: ViewContainerRef }) container: ViewContainerRef;
    @ViewChild("dtinput") dtinput;

    @HostListener('click', ['$event.target'])
    public onClick(targetElement) {
        this.dtinput.nativeElement.focus();
    }

    constructor(
        private _resolver: ComponentFactoryResolver,
        private _renderer: Renderer2,
        @Inject(DOCUMENT) private _document: any
    ) { }

    setValidateValue(target) {
        if (!this.isOpen()) {
            if(target.value != '')
                target.value = moment(target.value, this.dtTemplate).format(this.dtTemplate);
            else
                target.value = moment(new Date()).format(this.dtTemplate);
        }
    }

    handleKeyboard(event) {
        if (this.isOpen()) {
            const v = event.target.value;
            this._componentRef.instance.setDateTime(v);
            //this.dtinput.nativeElement.value = moment(v, this.dtTemplate).format(this.dtTemplate);
            //this.dtinput.nativeElement.setSelectionRange(3, 3);
            //console.log(this.dtinput.nativeElement.selectionStart);
            this.onChange((moment(v, this.dtTemplate).toISOString()));
        }
    }

    onChange (value: any) {}; //this.onChange(values);

    registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
      }

    registerOnTouched(fn: any): void { }

    writeValue(value: any): void {
        // Value is passed from outside via ngModel field
        this._setNewValue(value);
    }

    private _setNewValue(value: string) {
        let dt = new Date();
        if (value)
            dt = new Date(value);
        this.dtinput.nativeElement.value = moment(dt).format(this.dtTemplate);
    }

    private _applyStyling(nativeElement: any) {
        this._renderer.addClass(nativeElement, 'dropdown-menu');
        this._renderer.setStyle(nativeElement, 'padding', '0');
        this._renderer.addClass(nativeElement, 'show');
    }

    isOpen() { return !!this._componentRef; }

    open() {        
        this.container.clear(); 
        const factory = this._resolver.resolveComponentFactory(DtpickerWindowComponent);
        this._componentRef = this.container.createComponent(factory);
        this._applyStyling(this._componentRef.location.nativeElement);

        this._componentRef.instance.dtTemplate = this.dtTemplate;
        this._componentRef.instance.datetime = this.dtinput.nativeElement.value;
        this._componentRef.instance.ngOnInit();

        this._componentRef.instance.change.subscribe(
            dt => {
                this.dtinput.nativeElement.value = dt;
                this.onChange(moment(dt, this.dtTemplate).toISOString());
            }
        );

        this._renderer.listen(this._document, 'click', (e:MouseEvent) => {
            if (this._componentRef) {
                const target = e.target as Element;
                if (!(this._componentRef.location.nativeElement as Element).contains(target)) {
                    this.close();
                }
            }
        });
    }    

    close() {        
        this.container.remove(this.container.indexOf(this._componentRef.hostView));
        this._componentRef = null;
    }

    toggle() {
        if (this.isOpen()) {
          this.close();
        } else {
            setTimeout(() => this.open(), 0); //fix to click handler
        }
    }
}