import { Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter, Input, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { finalize, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SearchService } from '../../services/search.service';
import { AuthenticationService } from '../../services/auth.service';

@Component({
    selector: "app-test",
    templateUrl: './test.component.html'
})

export class TestComponent implements OnInit, OnDestroy, AfterViewInit {

    aContainerVisible: boolean = false;
    tags: Tag[] = [];

    searchResults: Tag[];

    @Input() initValue: string;

    @Output() pushInput = new EventEmitter<any>();

    private typeText: Subject<string> = new Subject();
    @ViewChild("tagsInput") tagsInput: ElementRef;
    @ViewChild("input") input: ElementRef;

    constructor(
        private searchService: SearchService,
        private authenticationService: AuthenticationService,
    ) {}

    ngAfterViewInit() { }

    ngOnInit() {

            //this.setTagsToInput();

            this.setInputToTags(this.initValue);

            this.typeText
            .pipe(
                filter(text => text.length > 1),
                debounceTime(500),
                //distinctUntilChanged(),
            )
            .subscribe(textValue => {
                this.loadSearchResults(textValue);
            });
        
    }

    eventHandler($event) {
        //if ($event.keyCode != 8)
        this.typeText.next($event.target.value);
        /*
        if ($event.keyCode == 13) {
            this.addTag($event);            
        }
        */
        
    } 

    loadSearchResults(str: string) {
        this.aContainerVisible = true;

        this.searchService.search('Channel', this.authenticationService.sessionId, {
            Query: [{Operation:0,Columns:[
                {Column: 8, Operation: 7, Value: str}
            ]}], 
            Page: { Start: 1, Length: 50, Sort: [{ Column: 8, Desc: false }]}
        })
            .pipe(
                //finalize(() => this.aContainerVisible = false)
            )
            .subscribe(
                data => { 
                    this.searchResults = data.map( item => new Tag(item));
                },
                error => {}
            );
    }

    setInputToTags(value: string) {
        const tagsIds = value.split(',');

        this.searchService.search('Channel', this.authenticationService.sessionId, {
            Query: [{Operation:0,Columns:[
                {Column: 1, Operation: 1, Value: tagsIds[0]}
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
        const values = this.tags.map( i => i.id).join(',');
        //this.tagsInput.nativeElement.value = this.tags.map( i => i.id).join(", ");
        this.pushInput.emit(values);
    }

    ngOnDestroy() {}

    addTag(tag: Tag) {
      
        this.tags.push(tag);
        this.setTagsToInput();

        this.input.nativeElement.value = ""; 
        
        this.aContainerVisible = false;
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