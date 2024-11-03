import { Component, Input } from '@angular/core';
import { Employee } from '../../model/employee.model';
import { DatePipe, NgIf } from '@angular/common';
import { EmployeeStatusPipe } from '../../pipe/employee-status.pipe';

@Component({
  selector: 'employee-info',
  standalone: true,
  imports: [NgIf, DatePipe, EmployeeStatusPipe],
  providers: [EmployeeStatusPipe],
  templateUrl: './employee-info.component.html',
  styleUrl: './employee-info.component.css'
})
export class EmployeeInfoComponent {

  @Input()
  public employee?: Employee;

  public getExperience(employmentDate: string): string {
    const diff: number = new Date().getFullYear() - Number(employmentDate.split('-')[0]);

    return diff.toString();
  }
}
