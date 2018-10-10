import { Component, Input, forwardRef } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface NgbDateTimeStruct extends NgbDateStruct, NgbTimeStruct {}

@Component({
  selector: 'ngbd-datetimepicker',
  templateUrl: './datetimepicker.component.html',
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgbDateTimePicker),
      multi: true
    }
  ]
})
export class NgbDateTimePicker implements ControlValueAccessor {

    @Input() model: NgbDateTimeStruct;
    date: NgbDateStruct;
    time: NgbTimeStruct = {hour: 0, minute: 0, second: 0};
    firstTimeAssign: boolean = true; // TODO make it private once ivy is default in Angular 7, see https://github.com/angular/angular/issues/11978

    /**
     * Date input placeholder.
     */
    @Input() datePlaceholder: String = "yyyy-mm-dd";

    /**
     * Number of months to display
     */
    @Input() displayMonths: number = 1;

    /**
     * First day of the week. With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
     */
    @Input() firstDayOfWeek: number;

    /**
     * Number of hours to increase or decrease when using a button.
     */
    @Input() hourStep: number;

    /**
     * Whether to display 12H or 24H mode.
     */
    @Input() meridian: boolean;

    /**
     * Number of minutes to increase or decrease when using a button.
     */
    @Input() minuteStep: number;

    /**
     * Navigation type: `select` (default with select boxes for month and year), `arrows`
     * (without select boxes, only navigation arrows) or `none` (no navigation at all)
     */
    @Input() navigation: 'select' | 'arrows' | 'none';

    /**
     * Whether to display days of the week
     */
    @Input() showWeekdays: boolean;

    /**
     * Whether to display week numbers
     */
    @Input() outsideDays: 'visible' | 'collapsed' | 'hidden';

    /**
     * Whether to display seconds input.
     */
    @Input() seconds: boolean;

    /**
     * Number of seconds to increase or decrease when using a button.
     */
    @Input() secondStep: number;

    /**
     * Whether to display week numbers
     */
    @Input() showWeekNumbers: boolean;

    /**
     * Whether to display the spinners above and below the inputs.
     */
    @Input() spinners: boolean;

    /**
     * To make timepicker readonly
     */
    @Input() timeReadonlyInputs: boolean;

    preparationOutput(date: NgbDateStruct, time: NgbTimeStruct): string {
        if (!date || !time)
            return '';
        else {
            const datetime = new Date(date.year, date.month, date.day, time.hour, time.minute, time.second);
            //return datetime.toISOString().slice(0, -5) + 'Z';
            return datetime.toISOString();
        }
    }

    preparationInput(value: string): NgbDateTimeStruct {
        if (!value)
            return null;
        const dt = new Date(value);
        const model = {
            year: dt.getFullYear(), 
            month: dt.getMonth(), 
            day: dt.getDate(), 
            hour: dt.getHours(), 
            minute: dt.getMinutes(), 
            second: dt.getSeconds() 
        };
        return model;
        
    }

    writeValue(newModel: any) {
        // Value is passed from outside via ngModel field
        
        this.setModel(this.preparationInput(newModel));
    }
    
    onChange (model: any) {};

    registerOnChange(fn: any): void {     
        this.onChange = fn;
    }

    registerOnTouched(): void {}

    onDateChange(date: NgbDateStruct) { // TODO make it private once ivy is default in Angular 7
        let time: NgbTimeStruct;
        if (this.model != null) {
            time = {hour: this.model.hour, minute: this.model.minute, second: this.model.second};
        } else {
            time = {hour: null, minute: null, second: null};
        }
        if (date == null || typeof date != "object") {
            date = {month: null, year: null, day: null};
        }
        this.setModel(<NgbDateTimeStruct>{month: date.month, year: date.year, day: date.day, ...time});
    }

    onTimeChange(time: NgbTimeStruct) { // TODO make it private once ivy is default in Angular 7
        let date: NgbDateStruct;
        if (this.model != null) {
            date = {month: this.model.month, year: this.model.year, day: this.model.day};
        } else {
            date = {month: null, year: null, day: null};
        }
        if (time == null) {
            time = {hour: null, minute: null, second: null};
        }
        this.setModel(<NgbDateTimeStruct>{...date, hour: time.hour, minute: time.minute, second: time.second});
    }

    setModel(model: NgbDateTimeStruct) { // TODO make it private once ivy is default in Angular 7
        this.model = model;
        if (model != null) {
            if (model.year != null) {
                this.date = {month: model.month, year: model.year, day: model.day};
            }
            if (model.hour != null) {
                this.time = {hour: model.hour, minute: model.minute, second: model.second};
            }
        } else {
            this.date = null;
            this.time = null;
        }
        if (!this.firstTimeAssign) {
            //this.onChange(model);
            //console.log(this.date, this.time);
            const value = this.preparationOutput(this.date, this.time);
            this.onChange(value);            
        } else {
            // Skip very first assignment to null done by Angular
            if (model !== null) {
                this.firstTimeAssign = false;
            }
        }
    }
}