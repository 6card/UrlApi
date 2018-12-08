import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DtpickerWindowComponent } from './dtpicker-window.component';
import { DtpickerComponent } from './dtpicker.component';

@NgModule({
    imports: [ CommonModule, NgbModule, FormsModule ],
    declarations: [ DtpickerWindowComponent, DtpickerComponent ],
    exports: [ DtpickerComponent ],
    entryComponents: [ DtpickerWindowComponent ]
})
export class DtpickerModule {
    public static forRoot() {
        return {
            ngModule: DtpickerModule,
        };
    }
}
