import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
//https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/

import { AuthenticationService } from '../../../services/auth.service';
import { PathService } from '../../../services/path.service';
import { ChannelService } from '../../../services/channel.service';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html'
})
export class PathComponent implements OnInit {
  pathByUrlForm: FormGroup;
  items: FormArray;
  submitLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private pathService: PathService,
    private channelService: ChannelService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.pathByUrlForm = this.formBuilder.group({
      url: [' https://www.newstube.ru/obrashchenie-putina', Validators.required],
      items: this.formBuilder.array([ this.createSearchItem() ])
    });

  }

  createSearchItem() {
    return this.formBuilder.group({
      name: '',
      description: '',
      price: ''
    });
  }

  addItem(): void {
    this.items = this.pathByUrlForm.get('items') as FormArray;
    this.items.push(this.createSearchItem());
  }

  onSearch() {
    this.channelService.search(this.authenticationService.sessionId, [])
    .pipe(first())
        .subscribe(
            data => {
              console.log(data);
            },
            error => {
                //console.log(error);
                //this.alertService.error(error);                
            },
            () => {
            });
  }

  onSubmit() {
    this.submitLoading = true;  

    if (this.pathByUrlForm.invalid) {
        return;
    }

    this.pathService.getByUrl(this.authenticationService.sessionId, this.pathByUrlForm.controls.url.value)
        .pipe(first())
        .subscribe(
            data => {
              console.log(data);
            },
            error => {
                console.log(error);
                //this.alertService.error(error);                
            },
            () => {
              this.submitLoading = false;
            });
    }

}
