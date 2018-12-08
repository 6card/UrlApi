import { Component, OnInit, forwardRef, HostBinding, Input, HostListener,
    ViewChild, ElementRef, ComponentRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { finalize, debounceTime, distinctUntilChanged, filter, first, } from 'rxjs/operators';
import { Observable, Subject, merge } from 'rxjs';

import { SearchService } from '../../services/search.service';
import { AuthenticationService } from '../../services/auth.service';
import { AutocompleteWindowComponent } from './autocomplete-window.component';

export class TagItem {
    id: number;
    title: string;

    constructor(obj: any) {
        this.id = obj.Id;
        this.title = obj.Name;
    }
}

@Component({
    selector: 'app-autocomplete',
    templateUrl: './autocomplete.component.html',
    host: {'class': 'autocomplete dropdown form-control'},
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => AutocompleteComponent),
          multi: true
        }
    ]
})
export class AutocompleteComponent implements OnInit, ControlValueAccessor {
    aContainerVisible: boolean = false;
    tags: TagItem[] = [];

    searchResults: TagItem[];

    private loadingResults: boolean = false;

    private componentRef: ComponentRef<AutocompleteWindowComponent>;
    private el: HTMLElement; // this element element, can be any

    @Input() initValue: string;
    @Input() multiValue: boolean;
    @Input() typeId: number;

    private typeText: Subject<string> = new Subject();
    @ViewChild(AutocompleteWindowComponent)
    private aWindow: AutocompleteWindowComponent;

    @ViewChild('input') input: ElementRef;
    @ViewChild('tagInput') tagInput: ElementRef;

    constructor(
        private searchService: SearchService,
        private authenticationService: AuthenticationService,
        public viewContainerRef: ViewContainerRef,
        private resolver: ComponentFactoryResolver,
        private _elementRef: ElementRef
    ) {
        this.el = this.viewContainerRef.element.nativeElement;
    }

    @HostListener('click', ['$event.target'])
    public onClick(targetElement) {
        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (clickedInside && !this.aContainerVisible) {
            this.loadSearchResults();

            // this.typeText.next(this.input.nativeElement.value);
        }
    }

    writeValue(newModel: string) {
        // Value is passed from outside via ngModel field
        this.setInputToTags(newModel);
    }

    onChange (model: any) {}

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(): void {}


    closeWindow($event) {
        const clickedInside = this._elementRef.nativeElement.contains($event);
        if (!clickedInside) {
            this.aContainerVisible = false;
        }
    }

    ngOnInit() {

        // this.input.nativeElement.addEventListener('click', (e) => this.loadSearchResults());
        // this.input.nativeElement.addEventListener('blur', (e) => setTimeout(() => this.aContainerVisible = false, 150));
        // this.setTagsToInput();
        /*
            if (this.initValue)
            this.setInputToTags(this.initValue);
        */

        this.typeText
            .pipe(
                // filter(text => text.length > 0),
                debounceTime(500),
                distinctUntilChanged(),
            )
            .subscribe(textValue => {
                this.loadSearchResults(textValue);
            });

    }


    loadSearchResults(str?: string | number[]) {
        this.aContainerVisible = true;
        this.loadingResults = true;
        const query = [{Operation: 0, Columns: [{Column: 8, Operation: 11, Value: str}]}];
        if (this.tags.length > 0) {
            const ids = this.tags.map( i => i.id);
            query.push({Operation: 1, Columns: [{Column: 1, Operation: 10, Value: ids}]});
        }
        this.searchService.search(this.typeId, this.authenticationService.sessionId, {
            Query: query,
            Page: { Start: 1, Length: 50, Sort: [{ Column: 8, Desc: false }]}
        })
            .pipe(
                finalize(() => this.loadingResults = false),
                first(),
                distinctUntilChanged(),
                // finalize(() => this.aContainerVisible = false)
            )
            .subscribe(
                data => {
                    this.searchResults = data.map( item => new TagItem(item));
                    this.aWindow.resetActive();
                    // this.showAutoCompleteDropdown();
                },
                error => {}
            );
    }

    setInputToTags(value: string) {
        let tagsIds: Array<string>;
        if (!value) {
            return;
        }

        if (Array.isArray(value)) {
            tagsIds = value;
        } else {
            tagsIds = value.split(', ');
        }

        this.tagInput.nativeElement.value = tagsIds;

        this.searchService.search(this.typeId, this.authenticationService.sessionId, {
            Query: [{ Operation: 0, Columns: [
                {Column: 1, Operation: 9, Value: tagsIds}
            ]}],
            Page: { Start: 1, Length: 50, Sort: [{ Column: 1, Desc: false }]}
        })
            .pipe(
                // finalize(() => this.aContainerVisible = false)
            )
            .subscribe(
                data => {
                    this.tags = data.map( item => new TagItem(item));
                },
                error => {}
            );


    }

    setTagsToInput() {
        const values = this.tags.map( i => i.id).join(', ');
        this.tagInput.nativeElement.value = values;
        this.onChange(values);
    }


    addTag(tag: TagItem) {
        if (this.multiValue) {
            this.tags.push(tag);
        } else {
            this.tags = [tag];
        }

        this.setTagsToInput();
        this.input.nativeElement.value = '';
        // this.input.nativeElement.blur();

        this.aContainerVisible = false;
        // this.isChangedTagFlag = true;
        // this.hideAutoCompleteDropdown();
    }

    handleKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 8: // backspace
                this.removeLastTag(event);
                break;

            case 40: // down
                event.preventDefault();
                if (this.aWindow) {
                    this.aWindow.selectNext();
                }
                break;
            case 38: // up
                event.preventDefault();
                if (this.aWindow) {
                    this.aWindow.selectPrev();
                }
                break;

            case 13: // enter
                event.preventDefault();
                if (this.aWindow) {
                    const result = this.aWindow.getActive();
                    if (result) {
                        this.addTag(result);
                    }
                }
                break;

            case 27: // escape
                event.preventDefault();
                this.aContainerVisible = false;
                break;
        }
    }

    handleKeyUp($event) {
        if ($event.keyCode !== 13 && $event.keyCode !== 40 && $event.keyCode !== 38) {
            this.typeText.next($event.target.value);
        }

        /*
        if ($event.keyCode == 13) {
            this.addTag($event);
        }
        */
    }

    removeLastTag($event) {
        if ($event.target.value.length === 0) {
            this.removeTag(this.tags.length - 1);
        }

    }

    removeTag(i: number) {
        this.tags.splice(i, 1);
        this.setTagsToInput();
    }

}
