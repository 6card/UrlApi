import { Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter, Input, HostListener, ViewChild, ElementRef, ComponentRef, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { finalize, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Observable, Subject, merge } from 'rxjs';

import { SearchService } from '../../services/search.service';
import { AuthenticationService } from '../../services/auth.service';
import { AutocompleteWindowComponent } from './autocomplete-window.component';

@Component({
    selector: "app-test",
    templateUrl: './autocomplete.component.html'
})

export class AutocompleteComponent implements OnInit, OnDestroy, AfterViewInit {
    activeIdx = 0;
    focusFirst = false;
    aContainerVisible: boolean = false;
    tags: Tag[] = [];

    searchResults: Tag[];

    private componentRef: ComponentRef<AutocompleteWindowComponent>;
    private el: HTMLElement; // this element element, can be any

    @Input() initValue: string;
    @Input() multiValue: boolean;
    @Input() typeId: number;

    @Output() pushInput = new EventEmitter<any>();

    private typeText: Subject<string> = new Subject();
    @ViewChild("tagsInput") tagsInput: ElementRef;
    @ViewChild("input") input: ElementRef;

    constructor(
        private searchService: SearchService,
        private authenticationService: AuthenticationService,
        public viewContainerRef: ViewContainerRef,
        private resolver: ComponentFactoryResolver,
    ) {
        this.el = this.viewContainerRef.element.nativeElement;
        console.log(this.el);
    }

    ngAfterViewInit() { }

    ngOnInit() {
        
        this.input.nativeElement.addEventListener('focus', (e) => this.loadSearchResults());
        //this.input.nativeElement.addEventListener('blur', (e) => setTimeout(() => this.aContainerVisible = false, 150));
            //this.setTagsToInput();
            if (this.initValue)
                this.setInputToTags(this.initValue);

            this.typeText
            .pipe(
                //filter(text => text.length > 1),
                debounceTime(500),
                distinctUntilChanged(),
            )
            .subscribe(textValue => {
                this.loadSearchResults(textValue);
            });
        
    }

    public showAutoCompleteDropdown = (event?: any): void => {
        if (!this.componentRef) {
            const factory = this.resolver.resolveComponentFactory(AutocompleteWindowComponent);
            this.componentRef = this.viewContainerRef.createComponent(factory);
            this.componentRef.instance.selectEvent.subscribe((result: any) => this.addTag(result));
            this.componentRef.instance.clickOutside.subscribe(result => this.hideAutoCompleteDropdown());
        }
        this.componentRef.instance.searchResults = this.searchResults;
    }

    public hideAutoCompleteDropdown = (event?: any): void => {
        if (this.componentRef) {
            //this.componentRef.instance.selectEvent.unsubscribe();
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

    loadSearchResults(str?: string) {
        this.aContainerVisible = true;

        this.searchService.search(this.typeId, this.authenticationService.sessionId, {
            Query: [{Operation:0,Columns:[
                {Column: 8, Operation: 7, Value: str ? str : ''}
            ]}], 
            Page: { Start: 1, Length: 50, Sort: [{ Column: 8, Desc: false }]}
        })
            .pipe(
                //finalize(() => this.aContainerVisible = false)
            )
            .subscribe(
                data => { 
                    this.searchResults = data.map( item => new Tag(item));
                    this.showAutoCompleteDropdown();
                },
                error => {}
            );
    }

    setInputToTags(value) {
        let tagsIds: any[] = [];
        if (Array.isArray(value))
            tagsIds = value;
        else
            tagsIds = value.split(', ');

        this.searchService.search(this.typeId, this.authenticationService.sessionId, {
            Query: [{Operation:0,Columns:[
                {Column: 1, Operation: 9, Value: tagsIds}
            ]}], 
            Page: { Start: 1, Length: 50, Sort: [{ Column: 1, Desc: false }]}
        })
            .pipe(
                //finalize(() => this.aContainerVisible = false)
            )
            .subscribe(
                data => { 
                    this.tags = data.map( item => new Tag(item));
                },
                error => {}
            );


    }

    setTagsToInput() {
        const values = this.tags.map( i => i.id).join(', ');
        //this.tagsInput.nativeElement.value = this.tags.map( i => i.id).join(", ");
        this.pushInput.emit(values);
    }

    ngOnDestroy() {}

    addTag(tag: Tag) {
        if (this.multiValue)
            this.tags.push(tag);
        else
            this.tags = [tag];

        this.setTagsToInput();
        this.input.nativeElement.value = "";         
        this.aContainerVisible = false;

        this.hideAutoCompleteDropdown();
    }

    

    

    handleKeyDown(event: KeyboardEvent) {
        //console.log(event.which);

        //40 - down
        //38 - up
        //13 - enter
        //8 - backspace
        //27 - escape
        switch (event.which) {
            case 8: //backspace
                this.removeLastTag(event);
                break;

            case 40: // down
                event.preventDefault();
                this.componentRef.instance.selectNext();
                break;
            case 38: // up
                event.preventDefault();
                this.componentRef.instance.selectPrev();
                break;

            case 13: // enter
                event.preventDefault();
                const result = this.componentRef.instance.getActive();
                if (result) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.addTag(result);
                }
                this.hideAutoCompleteDropdown();
                break;
        }
    }

    handleKeyUp($event) {
        //if ($event.keyCode != 8)
        this.typeText.next($event.target.value);
        /*
        if ($event.keyCode == 13) {
            this.addTag($event);            
        }
        */
        
    }

    removeLastTag($event) {  
        if ($event.target.value.length == 0)
            this.removeTag(this.tags.length - 1)
        
    }

    removeTag(i: number) {
        this.tags.splice(i, 1); 
        this.setTagsToInput();
    }

}

class Tag {
    id: number;
    title: string;

    constructor(obj: any) {
        this.id = obj.Id;
        this.title = obj.Name;
    }
}