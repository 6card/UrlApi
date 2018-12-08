import { Directive, OnInit, OnChanges, AfterViewInit, Input, Renderer2, ElementRef, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appLoading]'
})
export class LoadingDirective implements OnInit {
    private loaderCotainer: ElementRef;
    @Input() appLoading: boolean;

    constructor(private el: ElementRef, private renderer: Renderer2) {
        const loader = this.renderer.createElement('div');
        this.loaderCotainer = this.renderer.createElement('div');
        this.renderer.addClass(this.loaderCotainer, 'loader-container');
        this.renderer.addClass(loader, 'loader');
        this.renderer.addClass(loader, 'loader-60');
        this.renderer.appendChild(this.loaderCotainer, loader);
        // this.renderer.appendChild(el.nativeElement, loaderCotainer);
    }

    ngOnInit() { }

    pasteLoader() {
        if (this.appLoading) {
            this.renderer.appendChild(this.el.nativeElement, this.loaderCotainer);
        } else {
            this.renderer.removeChild(this.el.nativeElement, this.loaderCotainer);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.appLoading) {
          this.pasteLoader();
        }
    }
}

@Directive({
    selector: '[btnLoading]'
  })
  export class BtnLoadingDirective implements OnInit, AfterViewInit, OnChanges {
      private loaderCotainer: ElementRef;
      private btnText: string;
      private loader;
      @Input() btnLoading: boolean;

      constructor(private el: ElementRef, private renderer: Renderer2) {
          this.loader = this.renderer.createElement('span');
          this.renderer.addClass(this.loader, 'loader');
          this.renderer.addClass(this.loader, 'loader-20');
          this.renderer.addClass(this.loader, 'loader-inverse');
          this.renderer.appendChild(this.el.nativeElement, this.loader);
      }
      ngOnInit() {}

      ngAfterViewInit() {
        this.btnText = this.renderer.createText(this.el.nativeElement.innerText);
        this.el.nativeElement.innerText = '';
        this.renderer.appendChild(this.el.nativeElement, this.btnText);
      }
  
      pasteLoader() {
          if (this.btnLoading) {
            this.setExplicitButtonWidth();
            this.renderer.setAttribute(this.el.nativeElement, 'disabled', '');
            this.renderer.appendChild(this.el.nativeElement, this.loader);
            this.renderer.removeChild(this.el.nativeElement, this.btnText);
          } else {
            this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
            this.renderer.removeChild(this.el.nativeElement, this.loader);
            if (this.btnText) {
                this.renderer.appendChild(this.el.nativeElement, this.btnText);
            }
          }
      }

      private setExplicitButtonWidth() {
        if (this.el.nativeElement && this.el.nativeElement.getBoundingClientRect) {
          const boundingClientRect = this.el.nativeElement.getBoundingClientRect();
          this.renderer.setStyle(this.el.nativeElement, 'width', `${boundingClientRect.width}px`);
        }
      }

      ngOnChanges(changes: SimpleChanges) {
          if (changes.btnLoading) {
            this.pasteLoader();
          }
      }
}
