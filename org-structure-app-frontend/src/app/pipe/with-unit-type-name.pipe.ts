import { Pipe, PipeTransform } from '@angular/core';
import { OrganizationalUnit } from '../model/organizational-unit.model';
import { OrganizationalUnitType } from '../model/organizational-unit-type.enum';

@Pipe({
  name: 'withUnitTypeName',
  standalone: true
})
export class WithUnitTypeNamePipe implements PipeTransform {

  transform(unit: OrganizationalUnit): string {
    let type: string = "";
    switch (unit.type) {
      case OrganizationalUnitType.LEGAL_ENTITY: {
        type = "Юр.лицо";
        break;
      }
      case OrganizationalUnitType.DIVISION: {
        type = "Подразделение";
        break;
      }
      case OrganizationalUnitType.DEPARTMENT: {
        type = "Отдел";
        break;
      }
      case OrganizationalUnitType.GROUP: {
        type = "Группа";
        break;
      }
    }
    return `${type} "${unit.name}"`;
  }

}
