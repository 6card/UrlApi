import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchComponent } from '../../pages/search/search.component';
import { SetObjectModal } from './set-object-modal.component';

@NgModule({
    imports: [ CommonModule ],
    declarations: [ SetObjectModal, SearchComponent ],
    exports: [ SetObjectModal, SearchComponent ],
    entryComponents: [ SetObjectModal ],
})
export class ModalModule { 
    public static forRoot() {
        return {
            ngModule: ModalModule,
        };
    }
}