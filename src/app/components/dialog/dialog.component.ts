import { Component, Input, Output, OnInit, EventEmitter  } from '@angular/core';

@Component({
    selector: 'search-dialog',
    templateUrl: './dialog.component.html',
})

export class DialogComponent {
    @Input() open: boolean = false;   

}