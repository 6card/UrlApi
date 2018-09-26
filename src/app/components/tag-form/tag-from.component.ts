import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { Subject } from 'rxjs/index';

import { debounceTime, distinctUntilChanged, takeUntil, first } from 'rxjs/operators';

import { PathService } from '../../services/path.service';

import { ObjectBase } from '../../models/object-base';

@Component({
    selector: "app-tag-form",
    templateUrl: "./tag-form.component.html"
})

export class TagFormComponent implements OnInit, OnDestroy {

    tagForm = new TagFormGroup();

    newTag: ObjectBase = new ObjectBase();
    formSubmitted: boolean = false;

    private unsubscribe: Subject<void> = new Subject();

    @Input() currentObject: ObjectBase;

    constructor(
        private pathService: PathService,
    ) {}

    @Output() newTagEvent = new EventEmitter<ObjectBase>();

    ngOnInit() {
        if (this.currentObject)
            this.tagForm.patchValue(this.currentObject);

        this.tagForm.get('Name').valueChanges
            .pipe( 
                takeUntil(this.unsubscribe),             
                debounceTime(500),
                distinctUntilChanged(),           
            )
            .subscribe( val => {
                this.setPathLatin(val);
                //console.log(val);
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    setPathLatin(text: string) {
        this.pathService.getLatin(text)
        .pipe(
            first(),
        )
        .subscribe( data => this.tagForm.get('PathLatin').setValue(data));
    }   

    submitForm(form: any) {
        this.tagForm.markControlsTouched();

        if (!this.tagForm.valid)
            return;

        this.formSubmitted = true;
        if (form.valid) {
            //this.newTag = new ObjectBase(this.tagForm.value);
            this.newTagEvent.emit(this.tagForm.value);
            //this.newTag = new ObjectBase();
            //this.tagForm.reset();            
        }
        this.formSubmitted = false;
    }
}

class TagFormControl extends FormControl {
    label: string;
    modelProperty: string;
    type: number;

    constructor(label:string, property:string, type: number, value: any, validator?: any) {
        super(value, validator);
        this.label = label;
        this.modelProperty = property;
        this.type = type;
    }

    get isValid() {
        return this.invalid && this.touched;
    }

    
    getValidationMessages() {
        let messages: string[] = [];
        if (this.errors) {
            for (let errorName in this.errors) {
                switch (errorName) {
                    case "required":
                        messages.push(`You must enter a ${this.label}`);
                    break;
                    case "minlength":
                        messages.push(`A ${this.label} must be at least ${this.errors['minlength'].requiredLength} characters`);
                    break;
                    case "maxlength":
                        messages.push(`A ${this.label} must be no more than ${this.errors['maxlength'].requiredLength} characters`);
                    break;
                    case "limit":
                        messages.push(`A ${this.label} cannot be more than ${this.errors['limit'].limit}`);
                    break;
                    case "pattern":
                        messages.push(`The ${this.label} containsillegal characters`);
                    break;
                }
            }
        }
        if (messages.length > 0)
            return messages;

        return null;
    }
    getValidationLastMessage() {
        return this.getValidationMessages()[0] || null;
    }
    
}

const CONTROL_INPUT = 0;
const CONTROL_TEXTAREA = 1;
const CONTROL_CHECKBOX = 2;
const CONTROL_SELECT = 3;

class TagFormGroup extends FormGroup {

    constructor() {
        super({
            Name: new TagFormControl("Name", "Name", CONTROL_INPUT, "", Validators.compose([Validators.required])),
            Description: new TagFormControl("Description", "Description", CONTROL_TEXTAREA, ""),
            SeoEnable: new TagFormControl("SeoEnable", "SeoEnable", CONTROL_CHECKBOX, false),
            SeoTitle: new TagFormControl("SeoTitle", "SeoTitle", CONTROL_INPUT, ""),
            SeoDescription: new TagFormControl("SeoDescription", "SeoDescription", CONTROL_TEXTAREA, ""),
            SeoKeywords: new TagFormControl("SeoKeywords", "SeoKeywords", CONTROL_INPUT, ""),
            SeoNoIndex: new TagFormControl("SeoNoIndex", "SeoNoIndex", CONTROL_CHECKBOX, false),
            PathLatin: new TagFormControl("PathLatin", "PathLatin", CONTROL_INPUT, ""),
            /*
            PathParentId: new TagFormControl("PathParentId", "PathParentId", CONTROL_INPUT, ""),
            PathId: new TagFormControl("PathId", "PathId", CONTROL_INPUT, ""),
            */
        });
    }

    get tagControls(): TagFormControl[] {
        return Object.keys(this.controls).map(k => this.controls[k] as TagFormControl);
    }

    public markControlsTouched() {
        (Object).values(this.controls).forEach( control => control.markAsTouched() );
    }

    /*
    getFormValidationMessages(form: any) : string[] {
        let messages: string[] = [];
        this.productControls.forEach(c => c.getValidationMessages().forEach(m => messages.push(m)));
            return messages;
    }
    */
}