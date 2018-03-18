import {Component, OnInit, ViewChild} from '@angular/core';
import {DlDateTimePickerComponent} from 'angular-bootstrap-datetimepicker';

@Component({
  selector: 'app-calendar-control',
  templateUrl: './calendar-control.component.html',
  styleUrls: ['./calendar-control.component.css']
})
export class CalendarControlComponent implements OnInit {
  @ViewChild('dlDateTimePicker') dlDateTimePicker: DlDateTimePickerComponent<Date>;
  constructor() { }

  getDate(): Date {
    return this.dlDateTimePicker.value;
  }
  ngOnInit() {
  }

}
