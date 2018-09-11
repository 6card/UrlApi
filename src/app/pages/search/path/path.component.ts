import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
//https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/

import { AuthenticationService } from '../../../services/auth.service';
import { PathService } from '../../../services/path.service';
import { SearchService } from '../../../services/search.service';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html'
})
export class PathComponent implements OnInit {
  pathByUrlForm: FormGroup;
  submitLoading: boolean = false;
  item: Object = null;

  constructor(
    private formBuilder: FormBuilder,
    private pathService: PathService,
    private searchService: SearchService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.pathByUrlForm = this.formBuilder.group({
      url: [' https://www.newstube.ru/obrashchenie-putina', Validators.required],
    });
  }

  onSubmit() {
    this.submitLoading = true;  

    if (this.pathByUrlForm.invalid) {
        return;
    }

    this.pathService.getByUrl(this.authenticationService.sessionId, this.pathByUrlForm.controls.url.value)
        .subscribe(
            data => {
              this.item = data;
              //console.log(data);
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
