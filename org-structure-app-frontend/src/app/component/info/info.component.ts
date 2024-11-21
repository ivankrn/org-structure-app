import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectedUnit } from '../../model/selected-unit.model';
import { Employee } from '../../model/employee.model';
import { EmployeeInfoComponent } from '../employee-info/employee-info.component';
import { Observable } from 'rxjs';
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
  @Input()
  public type: Observable<string>;

  @Output()
  public enterToEmployee: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  public employee?: Employee;

  @Input()
  public unit?: SelectedUnit;
}
