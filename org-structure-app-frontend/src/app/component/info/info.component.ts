import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { SelectedUnit } from '../../model/selected-unit.model';
import { Employee } from '../../model/employee.model';
import { EmployeeInfoComponent } from '../employee-info/employee-info.component';
import { AsyncPipe } from '@angular/common';
import { UnitInfoComponent } from '../unit-info/unit-info.component';

@Component({
  selector: 'info',
  standalone: true,
  imports: [
    EmployeeInfoComponent,
    AsyncPipe,
    UnitInfoComponent
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  @Output()
  public enterToEmployee: EventEmitter<number> = new EventEmitter<number>();

  public type: InputSignal<string | undefined> = input.required();
  public employee: InputSignal<Employee | undefined> = input.required();
  public unit: InputSignal<SelectedUnit | undefined> = input.required();
}
