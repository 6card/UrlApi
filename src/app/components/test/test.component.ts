import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, ViewChild, ElementRef } from "@angular/core";

@Component({
    selector: "app-test",
    template: `
    <div class="autocomplete-wrapper">
        <span class="label label-blue label-nopadding clickable" *ngFor="let tag of tags; let i = index;">
            {{tag}}
            <clr-icon shape="window-close" (click)="removeTag(i)"></clr-icon>
        </span>
        <input #input type="text" class="no-style" (keyup)="eventHandler($event)" (keydown.backspace)="removeLastTag($event)">
        <input #tagsInput type="hidden">
        <div class="autocomplete-container" *ngIf="aContainerVisible">
            <div class="autocomplete-item" (click)="addTag($event)">First Action</div>
            <div class="autocomplete-item">Second Action</div>        
        </div>
    </div>
    `
})

export class TestComponent implements OnInit, OnDestroy {

    aContainerVisible: boolean = false;
    tags: any[] = ['123', '456'];

    @ViewChild("tagsInput") tagsInput: ElementRef;
    @ViewChild("input") input: ElementRef;

    ngOnInit() {
        this.setTagsToInput();
    }

    eventHandler($event) {
        if ($event.keyCode != 8)
            this.aContainerVisible = true;
        if ($event.keyCode == 13) {
            this.addTag($event);            
        }
        
     } 

    setTagsToInput() {
        this.tagsInput.nativeElement.value = this.tags.join(", ");
    }

    ngOnDestroy() {}

    addTag($event) {
        let value = $event.target.value;
        if (!$event.target.value)
            value = $event.target.innerHTML;
        this.tags.push(value);
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