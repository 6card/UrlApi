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
  //searchItems: FormArray;
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

  createTagSearchItem(qop: number = 0) {
    return this.formBuilder.group({
      queryOperation: [qop, Validators.required],
      column: [null, Validators.required],
      operation: [null, Validators.required],
      value: ['', Validators.required]
    });
  }

  deleteTagSearchItem(index: number) {
    let searchItems: FormArray;    
    searchItems = this.tagSearchForm.get('items') as FormArray;
    searchItems.removeAt(index);
  }

  addItem(qop? : number): void {
    let searchItems: FormArray;
    searchItems = this.tagSearchForm.get('items') as FormArray;
    searchItems.push(this.createTagSearchItem(qop));
  }

  getCondition(qop: number) {
    switch (qop) {
      case 0 : return "ИЛИ";
      case 1 : return "И";
      case 2 : return "НЕ";
    }
  }

  public controlIsInvalid(control) {
    return control.invalid && control.touched;
  }

  
  public markFormGroupTouched(formGroup: FormGroup) {
    let searchItems: FormArray;
    searchItems = formGroup.get('items') as FormArray;


    (<any>Object).values(searchItems.controls).forEach(control => {
      control.get('column').markAsTouched();
      control.get('operation').markAsTouched();
      control.get('value').markAsTouched();
    });
 
    //searchItems.controls[0].get('value').setValue('yourEmailId@gmail.com');
    //searchItems.controls[0].get('value').markAsTouched();

    //console.log(this.tagSearchForm.controls.items);

  }
  
 
  onSubmit() {
    this.markFormGroupTouched(this.tagSearchForm);
    if (!this.tagSearchForm.valid)
      return;

    this.submitLoading = true;
    let arr = {
      Query: this.tagSearchForm.controls.items.value
      .map(item => {
        return {
              Operation: item.queryOperation,  
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

      //console.log(arr);
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
            this.submitLoading = false;
        });
  }

}
