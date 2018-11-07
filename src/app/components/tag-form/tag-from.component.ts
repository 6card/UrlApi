import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges, SimpleChanges, SimpleChange } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { Subject } from 'rxjs/index';

import { debounceTime, distinctUntilChanged, takeUntil, first, filter } from 'rxjs/operators';

import { PathService } from '../../services/path.service';
import { AuthenticationService } from '../../services/auth.service';

import { ObjectBase } from '../../models/object-base';

@Component({
    selector: "app-tag-form",
    templateUrl: "./tag-form.component.html"
})

export class TagFormComponent implements OnInit, OnDestroy, OnChanges {

    tagForm = new TagFormGroup();

    newTag: ObjectBase = new ObjectBase();
    formSubmitted: boolean = false;

    public parents: Array<any>;

    private unsubscribe: Subject<void> = new Subject();

    @Input() currentObject: ObjectBase;

    constructor(
        private pathService: PathService,
        private authenticationService: AuthenticationService,
    ) {}

    @Output() newTagEvent = new EventEmitter<ObjectBase>();

    ngOnChanges(changes: SimpleChanges) {
        const object: SimpleChange = changes.currentObject;

        if (object)
            this.tagForm.patchValue(object.currentValue);
    }

    ngOnInit() {
        

        this.tagForm.get('Name').valueChanges
            .pipe( 
                takeUntil(this.unsubscribe),             
                debounceTime(500),
                distinctUntilChanged(),
                filter(_ => !this.tagForm.get('GenerateLatin').value)           
            )
            .subscribe( val => {
                this.setPathLatin(val);
            });

        this.pathService.getParents(this.authenticationService.sessionId)
        .subscribe( 
            data => {
                this.parents = data;
                if (!data.find( i => i.Id == this.tagForm.get('ParentPathId').value)) {
                    this.parents.push({Id: this.tagForm.get('ParentPathId').value, PathLatin: this.tagForm.get('ParentPathLatin').value})
                }
                
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    public resetPath() {
        this.tagForm.get('PathId').setValue('');
        this.tagForm.get('PathSuffix').setValue('');
    }

    setPathLatin(text: string) {
        if (text.length == 0) {
            this.tagForm.get('PathLatin').setValue('')
            return;
        }
        this.pathService.getLatin(text)
        .pipe( first() )
        .subscribe( 
            data => {
                this.tagForm.get('PathLatin').setValue(data);
                this.resetPath();
        });
    }

    public controlIsInvalid(controlName: string): boolean {
        const control = this.tagForm.get(controlName) as TagFormControl;
        return control.invalid && control.touched;
    }

    public controlLabel(controlName: string): string {
        const control = this.tagForm.get(controlName) as TagFormControl;
        return control.label;
    }

    public controlProperty(controlName: string): string {
        const control = this.tagForm.get(controlName) as TagFormControl;
        return control.modelProperty;
    }

    public controlValidationMessage(controlName: string): string {
        const control = this.tagForm.get(controlName) as TagFormControl;
        return control.getValidationLastMessage();
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
            PathId: new TagFormControl("PathId", "PathId", CONTROL_INPUT, ""),
            
            PathLatin: new TagFormControl("PathLatin", "PathLatin", CONTROL_INPUT, ""),
            PathSuffix: new TagFormControl("PathSuffix", "PathSuffix", CONTROL_INPUT, ""),
            ParentPathLatin: new TagFormControl("ParentPathLatin", "ParentPathLatin", CONTROL_INPUT, ""),
            ParentPathId: new TagFormControl("ParentPathId", "ParentPathId", CONTROL_INPUT, ""),

            Url: new TagFormControl("Url", "Url", CONTROL_INPUT, ""),
            GenerateLatin: new TagFormControl("зафиксировать", "GenerateLatin", CONTROL_CHECKBOX, false),
            Name: new TagFormControl("Название", "Name", CONTROL_INPUT, "", Validators.compose([Validators.required])),
            Description: new TagFormControl("Описание", "Description", CONTROL_TEXTAREA, ""),
            SeoNoIndex: new TagFormControl("Запрет индексации", "SeoNoIndex", CONTROL_CHECKBOX, false),
            SeoEnable: new TagFormControl("Использовать данные SEO", "SeoEnable", CONTROL_CHECKBOX, false),
            SeoTitle: new TagFormControl("Title", "SeoTitle", CONTROL_INPUT, ""),
            SeoDescription: new TagFormControl("Description", "SeoDescription", CONTROL_TEXTAREA, ""),
            SeoKeywords: new TagFormControl("Keywords", "SeoKeywords", CONTROL_INPUT, ""),            
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