import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../services/auth.service';
import { PathService } from '../../../services/path.service';
import { ChannelService } from '../../../services/channel.service';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html'
})
export class TagComponent implements OnInit {
  tagSearchForm: FormGroup;
  searchItems: FormArray;
  submitLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private pathService: PathService,
    private channelService: ChannelService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.tagSearchForm = this.formBuilder.group({
      items: this.formBuilder.array([ this.createTagSearchItem() ])
    });
  }

  createTagSearchItem() {
    return this.formBuilder.group({
      column: ['', Validators.required],
      operation: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  addItem(): void {
    this.searchItems = this.tagSearchForm.get('items') as FormArray;
    this.searchItems.push(this.createTagSearchItem());
  }

  /*
  public markFormGroupTouched(formGroup: any) {
    Object.values(formGroup.controls.items.controls[0].controls).forEach(control => {
      control.markAsTouched();
      console.log(control);

    });
    
  }
  */
 
  onSubmit() {
    //this.markFormGroupTouched(this.tagSearchForm);
    let arr = {
      Query: this.tagSearchForm.controls.items.value
      .map(item => {
        return {
              Operation: 0, 
              Columns: [
                {
                  Column: item.column, 
                  Operation: item.operation, 
                  Value: item.value
                }
              ]          
        };
      }),
      Page: {
        Start: 1,        
        Length: 10,        
        Sort: [        
          {        
            Column: 1,        
            Desc: true        
          }        
         ]        
        }
    };

      console.log(arr);
      this.channelService.search(this.authenticationService.sessionId, arr)
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

}
