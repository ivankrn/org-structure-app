import { Pipe, PipeTransform } from '@angular/core';
import { EmployeeStatus } from '../model/employee-status.enum';

@Pipe({
  name: 'asRussianText',
  standalone: true
})
export class EmployeeStatusPipe implements PipeTransform {

  transform(status: EmployeeStatus): string {
    let statusAsText: string = "";
    switch (status) {
      case EmployeeStatus.ON_MATERNITY_LEAVE: {
        statusAsText = "в декрете";
        break;
      }
      case EmployeeStatus.ON_VACATION: {
        statusAsText = "в отпуске";
        break;
      }
      case EmployeeStatus.ON_SICK_LEAVE: {
        statusAsText = "на больничном";
        break;
      }
      case EmployeeStatus.ACTIVE: {
        statusAsText = "на работе";
        break;
      }
    }
    return statusAsText;
  }

}
