import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { Employee } from '../../model/employee.model';
import { DatePipe, NgIf, NgStyle } from '@angular/common';
import { EmployeeStatusPipe } from '../../pipe/employee-status.pipe';
import { EmployeeStatus } from '../../model/employee-status.enum';

@Component({
  selector: 'employee-info',
  standalone: true,
  imports: [NgIf, DatePipe, EmployeeStatusPipe, NgStyle],
  providers: [EmployeeStatusPipe],
  templateUrl: './employee-info.component.html',
  styleUrl: './employee-info.component.css'
})
export class EmployeeInfoComponent {

  public employee: InputSignal<Employee | undefined> = input.required();

  protected experience: Signal<string> = computed(() => {
    const employmentDate: string | undefined = this.employee()?.employmentDate;

    if (!employmentDate) {
      return '0';
    }

    const diff: number = new Date().getFullYear() - Number(employmentDate.split('-')[0]);

    return diff.toString();
  });

  protected imageUrl: Signal<string> = computed(() => {
    return `http://45.95.234.130${this.employee()?.imageUrl
        ? this.employee()?.imageUrl
        : '/content/images/profile/default_profile_image.png'}`;
  });

  protected statusColor: Signal<string> = computed(() => {
    let color: string = '';
    switch (this.employee()?.status) {
      case EmployeeStatus.ON_MATERNITY_LEAVE: {
        color = "blue";
        break;
      }
      case EmployeeStatus.ON_VACATION: {
        color = "yellow";
        break;
      }
      case EmployeeStatus.ON_SICK_LEAVE: {
        color = "red";
        break;
      }
      case EmployeeStatus.ACTIVE: {
        color = "green";
        break;
      }
      default: {
        color = "grey";
        break;
      }
    }

    return color;
  });
}
