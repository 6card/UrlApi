import { Component, OnInit, Input, Output, ViewChild, HostListener, EventEmitter, ElementRef} from "@angular/core";

import * as moment from 'moment';

import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: "dt-picker",
    templateUrl: './dtpicker.component.html',
})

export class DtpickerComponent implements OnInit {

    public date: NgbDateStruct;
    public time: NgbTimeStruct;
    public opened: boolean = false;
       
    @Input() datetime: string;
    @Input() dtTemplate: string = 'DD.MM.YYYY HH:mm';
    @Output() change = new EventEmitter<string>();
    @Output() clickOutside = new EventEmitter();

    @ViewChild("datepicker") datepicker;     

    /*
    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside && this.opened) {
            console.log('close');
        }
    }
    */

    constructor (private _elementRef: ElementRef) {}

    ngOnInit() {        
        this._setDateTime(this.datetime);
    }

    private _setDateTime(datetime: string) {
        if (!datetime)
            return;        
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