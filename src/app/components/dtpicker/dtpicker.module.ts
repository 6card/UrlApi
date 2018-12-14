import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

import { DtpickerWindowComponent } from './dtpicker-window.component';
import { DtpickerComponent } from './dtpicker.component';
import { CustomDatepickerI18n } from './datepicker-ru';

@NgModule({
    imports: [ CommonModule, NgbModule, FormsModule ],
    declarations: [ DtpickerWindowComponent, DtpickerComponent ],    
    providers: [ {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n} ],
    exports: [ DtpickerComponent ],
    entryComponents: [ DtpickerWindowComponent ]
})
export class DtpickerModule { }
