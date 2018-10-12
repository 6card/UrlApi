import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, Renderer2, Inject, ComponentRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { DtpickerWindowComponent } from '../components/dtpicker/dtpicker-window.component';

@Component({
    selector: 'test',
    template: `
        <dtpicker></dtpicker>
    `
})

export class TestComponent {
    
}