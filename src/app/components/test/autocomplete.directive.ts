import { Directive, ElementRef, TemplateRef, ViewContainerRef, ComponentFactoryResolver, Renderer2, HostListener } from "@angular/core";
import { TestComponent } from "./test.component";

@Directive({
    selector: "[autocomplete]",
})

export class AutocompleteDirective {

    wrapper: ElementRef;
    labels: Array<any>;

    constructor(
        private el: ElementRef,
        //private template: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private renderer: Renderer2,
    ) {
        //console.log(viewContainer);
    }

    ngOnInit() {
        //this.viewContainer.createEmbeddedView(this.template);
        const el = this.el.nativeElement;
        //let wrapper = this.wrapper;

        el.value = '123';

        this.wrapper = this.renderer.createElement('div');
        this.renderer.addClass(this.wrapper, 'autocomplete-wrapper');
              
        el.parentNode.insertBefore(this.wrapper, el);
        this.renderer.appendChild(this.wrapper, el);        
        this.renderer.removeClass(el, 'clr-input');
        this.renderer.addClass(el, 'no-style');  

        //let change_this = this.renderer.createElement('span');
        //this.renderer.addClass(change_this, 'change_this');
        //this.renderer.appendChild(change_this, this.el.nativeElement); 
    }

    @HostListener('keyup.enter', ['$event']) onKeyUp(evt: KeyboardEvent){
        this.addLabel(this.el.nativeElement.value);
    }

    public addLabel(value: any) {
        if (value.length <= 0) return;

        const parent = this.el.nativeElement.parentNode;
        const refChild = this.el.nativeElement;
        
        let label = this.renderer.createElement('span');
        let text = this.renderer.createText(value);
        let closeButton = this.renderer.createElement('clr-icon');
        closeButton.onclick = this.removeLabel(label);

        this.renderer.setAttribute(closeButton, 'shape', 'window-close');

        this.renderer.addClass(label, 'label');
        this.renderer.addClass(label, 'label-blue'); 
        this.renderer.addClass(label, 'clickable'); 
        this.renderer.addClass(label, 'label-nopadding');
        this.renderer.appendChild(label, text);
        this.renderer.appendChild(label, closeButton);
        //this.wrapper.nativeElement.insertBefore(this.wrapper.nativeElement, label.nativeElement);
        
        this.renderer.insertBefore(parent, label, refChild);

        refChild.value = "";

        //console.log(value);
    }

    public removeLabel(label) {
        //console.log(label);
        this.renderer.destroyNode(label);
        //const parent = this.el.nativeElement.parentNode;
        //this.renderer.removeChild(parent, label);
        //refreshTags();
    }
}   