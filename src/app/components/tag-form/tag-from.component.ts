import { Component, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { ObjectBase } from '../../models/object-base';

@Component({
    selector: "app-tag-form",
    templateUrl: "./tag-form.component.html"
})

export class TagFormComponent {

    tagForm = new TagFormGroup();

    newTag: ObjectBase = new ObjectBase();
    formSubmitted: boolean = false;

    @Output() newTagEvent = new EventEmitter<ObjectBase>();


    get tagControls(): FormControl[] {
        return Object.keys(this.tagForm.controls).map(k => this.tagForm.controls[k] as FormControl);
    }

    submitForm(form: any) {
        this.formSubmitted = true;
        if (form.valid) {
            this.newTagEvent.emit(this.newTag);
            this.newTag = new ObjectBase();
            this.tagForm.reset();            
        }
        this.formSubmitted = false;
    }
}

class TagFormControl extends FormControl {
    label: string;
    modelProperty: string;

    constructor(label:string, property:string, value: any, validator: any) {
        super(value, validator);
        this.label = label;
        this.modelProperty = property;
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


class TagFormGroup extends FormGroup {
    constructor() {
        super({
            Name: new TagFormControl("Name", "Name", "", Validators.required),
            Description: new TagFormControl("Description", "Description", "",
                Validators.compose([Validators.required,
                    Validators.pattern("^[A-Za-z ]+$"),
                    Validators.minLength(3),
                    Validators.maxLength(10)]
                )
            ),
            price: new TagFormControl("Price", "price", "",
                Validators.compose([Validators.required,
                    Validators.pattern("^[0-9\.]+$")]
                )
            )
        });
    }

    get tagControls(): TagFormControl[] {
        return Object.keys(this.controls).map(k => this.controls[k] as TagFormControl);
    }

    /*
    getFormValidationMessages(form: any) : string[] {
        let messages: string[] = [];
        this.productControls.forEach(c => c.getValidationMessages().forEach(m => messages.push(m)));
            return messages;
    }
    */
}