import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectedUnit } from '../../model/selected-unit.model';
import { EmployeeStatusPipe } from '../../pipe/employee-status.pipe';
import { NgClass, NgIf } from '@angular/common';
import { OrganizationalUnitType } from '../../model/organizational-unit-type.enum';
import { Employee } from '../../model/employee.model';

@Component({
  selector: 'unit-info',
  standalone: true,
  imports: [
    EmployeeStatusPipe,
    NgIf,
    NgClass
  ],
  templateUrl: './unit-info.component.html',
  styleUrl: './unit-info.component.css'
})
export class UnitInfoComponent {
  @Input({ required: true })
  unit?: SelectedUnit;

  @Output()
  public enterToEmployee: EventEmitter<number> = new EventEmitter<number>();

  protected readonly organizationalUnitType = OrganizationalUnitType;

  protected russianType(unitType: OrganizationalUnitType): string {
    switch (unitType) {
      case OrganizationalUnitType.LEGAL_ENTITY:
        return 'Юридическое лицо';
      case OrganizationalUnitType.DIVISION:
        return 'Подразделение';
      case OrganizationalUnitType.DEPARTMENT:
        return 'Отдел';
      case OrganizationalUnitType.GROUP:
        return 'Группа';
    }
  }

  protected onClickEmployee(employee?: Employee): void {
    if (employee?.id) {
      this.enterToEmployee.emit(employee.id);
    }
  }
}
