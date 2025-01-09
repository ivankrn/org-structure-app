import { Component, computed, EventEmitter, input, InputSignal, Output, Signal } from '@angular/core';
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
  unit: InputSignal<SelectedUnit | undefined> = input.required();

  @Output()
  public enterToEmployee: EventEmitter<number> = new EventEmitter<number>();

  protected readonly organizationalUnitType = OrganizationalUnitType;

  protected russianType: Signal<string> = computed(() => {
    switch (this.unit()?.type) {
      case OrganizationalUnitType.LEGAL_ENTITY:
        return 'Юридическое лицо';
      case OrganizationalUnitType.DIVISION:
        return 'Подразделение';
      case OrganizationalUnitType.DEPARTMENT:
        return 'Отдел';
      case OrganizationalUnitType.GROUP:
        return 'Группа';
      default:
          return '';
    }
  });

  protected headImageUrl: Signal<string> = computed(() => {
    return `http://45.95.234.130${this.unit()?.head?.imageUrl
        ? this.unit()?.head?.imageUrl
        : '/content/images/profile/default_profile_image.png'}`;
  });

  protected deputyImageUrl: Signal<string> = computed(() => {
    return `http://45.95.234.130${this.unit()?.deputy?.imageUrl
        ? this.unit()?.deputy?.imageUrl
        : '/content/images/profile/default_profile_image.png'}`;
  });

  protected onClickEmployee(employee?: Employee): void {
    if (employee?.id) {
      this.enterToEmployee.emit(employee.id);
    }
  }
}
