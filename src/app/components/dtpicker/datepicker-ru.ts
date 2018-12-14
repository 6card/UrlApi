import { Injectable, Inject} from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { APP_CONST } from '../../config/const';

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(@Inject(APP_CONST) private CONST) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return this.CONST.weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return this.CONST.months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
