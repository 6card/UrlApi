import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { Router, ActivatedRoute, Params } from '@angular/router';


import { AuthenticationService } from '../../services/auth.service';
import { PathService } from '../../services/path.service';
import { SearchService } from '../../services/search.service';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-search-path',
  templateUrl: './search-path.component.html'
})
export class SearchPathComponent implements OnInit {
  pathByUrlForm: FormGroup;
  submitLoading: boolean = false;
  item: Object = null;
  error: string = null;

  @Input() buttonLabel: string = 'Перейти';
  @Input() returnInputOnError: boolean = false;
  @Output() found = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private pathService: PathService,
    private searchService: SearchService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.pathByUrlForm = this.formBuilder.group({
      url: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.pathByUrlForm.invalid) {
        return;
    }

    this.submitLoading = true;
    this.error = null;

    this.pathService.getByUrl(this.authenticationService.sessionId, this.pathByUrlForm.controls.url.value)
      .pipe( finalize(() => this.submitLoading = false))
        .subscribe(
          data => {
            let result: any | boolean = false;
            if (data) {
              result = data;
            } else {
              if (this.returnInputOnError) {
                result = this.pathByUrlForm.controls.url.value;
                // this.pathByUrlForm.reset();
              }
            }
            this.found.emit(result);
        });
    }

}
