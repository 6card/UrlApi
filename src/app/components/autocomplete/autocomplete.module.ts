import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AutocompleteComponent } from './autocomplete.component';
import { AutocompleteWindowComponent } from './autocomplete-window.component';

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [AutocompleteComponent, AutocompleteWindowComponent],
    exports: [AutocompleteComponent, AutocompleteWindowComponent],
    entryComponents: [AutocompleteWindowComponent]
})
export class AutocompleteModule { }
