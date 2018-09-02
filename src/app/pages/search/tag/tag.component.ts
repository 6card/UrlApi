import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../services/auth.service';
import { PathService } from '../../../services/path.service';
import { ChannelService } from '../../../services/channel.service';

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
      column: '',
      operation: '',
      value: ''
    });
  }

  addItem(): void {
    this.searchItems = this.tagSearchForm.get('items') as FormArray;
    this.searchItems.push(this.createTagSearchItem());
  }

  onSubmit() {
    let arr = this.tagSearchForm.controls.items.value
      .map(item => {
        return `"Query" :[{"Operation": 0, "Columns": [{"Column": ${item.column}, "Operation": ${item.operation}, "Value": ${item.value}}]}]`;
      });

    console.log(arr);
  }

}
