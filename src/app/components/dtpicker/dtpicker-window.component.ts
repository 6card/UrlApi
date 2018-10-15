import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef} from "@angular/core";

import * as moment from 'moment';

import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: "dt-picker-window",
    templateUrl: './dtpicker-window.component.html',
})

export class DtpickerWindowComponent implements OnInit {

    public date: NgbDateStruct;
    public time: NgbTimeStruct;
       
    @Input() datetime: string;
    @Input() dtTemplate: string;
    @Output() change = new EventEmitter<string>();

    @ViewChild("datepicker") datepicker;     

    constructor (private _elementRef: ElementRef) {}

    ngOnInit() {        
        this.setDateTime(this.datetime);
        //this.change.emit(this._datetimeToString(this.date, this.time));
    }

    public setDateTime(datetime: string) {
        if (!datetime)
            datetime = moment().format(this.dtTemplate);
        const dt: Date = this._dateToString(datetime);
        this.date = {year: dt.getFullYear(), month: dt.getMonth()+1, day: dt.getDate()}; 
        this.time = {hour: dt.getHours(), minute: dt.getMinutes(), second: dt.getSeconds()};
        this.datepicker.navigateTo(this.date);
    }

    private _dateToString(dt: string): Date {
        return moment(dt, this.dtTemplate).toDate();
    }

    private _datetimeToString(date: NgbDateStruct, time: NgbTimeStruct): string {
        const d: Date = new Date(date.year, date.month-1, date.day, time.hour, time.minute);
        return moment(d).format(this.dtTemplate);
    }

    public onDateChange(date: NgbDateStruct) {
        this.date = date;
        this.change.emit(this._datetimeToString(this.date, this.time));
    }

    public onTimeChange(time: NgbTimeStruct) {
        this.time = time;
        this.change.emit(this._datetimeToString(this.date, this.time));
    }

}