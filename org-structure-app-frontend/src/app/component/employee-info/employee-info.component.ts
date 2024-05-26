import { Component, Input } from '@angular/core';
import { Employee } from '../../model/employee.model';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'employee-info',
  standalone: true,
  imports: [NgIf, DatePipe],
  templateUrl: './employee-info.component.html',
  styleUrl: './employee-info.component.css'
})
export class EmployeeInfoComponent {

  @Input()
  public employee?: Employee;

  public getExperience(employmentDate: string): string {
    const diff: number = new Date().getFullYear() - Number(employmentDate.split('-')[0]);
    const cases: string[] = ['лет', 'год', 'года', 'года', 'года', 'лет']

    return diff % 100 > 4 && diff % 100 < 20
        ? `${diff} ${cases[0]}`
        : `${diff} ${cases[Math.min(diff % 10, 5)]}`;
  }
}
