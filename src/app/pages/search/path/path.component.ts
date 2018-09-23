import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { Router, ActivatedRoute, Params } from "@angular/router";
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
  error: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private pathService: PathService,
    private searchService: SearchService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.pathByUrlForm = this.formBuilder.group({
      url: [' https://www.newstube.ru/obrashchenie-putina', Validators.required],
    });
  }

  onSubmit() {
    this.submitLoading = true;  
    this.error = null;

    if (this.pathByUrlForm.invalid) {
        return;
    }

    this.pathService.getByUrl(this.authenticationService.sessionId, this.pathByUrlForm.controls.url.value)
        .subscribe(
            data => {
              if(data) {
                this.item = data;
                this.router.navigate(['/path', data['Id']]);
              }
              else this.error = "Путь не найден";
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
