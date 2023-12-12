import { Component, Input } from '@angular/core';
import { Employee } from '../../model/employee.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'employee-info',
  standalone: true,
  imports: [NgIf],
  templateUrl: './employee-info.component.html',
  styleUrl: './employee-info.component.css'
})
export class EmployeeInfoComponent {

  @Input()
  employee?: Employee;

}
