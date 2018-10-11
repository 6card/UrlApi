import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DtpickerComponent } from './dtpicker.component';
//import { AutocompleteWindowComponent } from './autocomplete-window.component';

@NgModule({
    imports: [ CommonModule, NgbModule, FormsModule ],
    declarations: [ DtpickerComponent ],
    exports: [ DtpickerComponent ],
    entryComponents: [ DtpickerComponent ]
})
export class DtpickerModule {
    public static forRoot() {
        return {
            ngModule: DtpickerModule,
        };
    }
}