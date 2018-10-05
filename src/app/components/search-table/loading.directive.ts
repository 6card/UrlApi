import { Directive, OnInit, Input, Renderer2, ElementRef, SimpleChanges } from '@angular/core';

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
        this.renderer.appendChild(this.loaderCotainer, loader);
        //this.renderer.appendChild(el.nativeElement, loaderCotainer);
    }

    ngOnInit() {
        
    }

    pasteLoader() {
        if (this.appLoading)
            this.renderer.appendChild(this.el.nativeElement, this.loaderCotainer);
        else
            this.renderer.removeChild(this.el.nativeElement, this.loaderCotainer);
    }

    ngOnChanges(changes: SimpleChanges){
        if(changes.appLoading){
          this.pasteLoader();
        }
    }
}