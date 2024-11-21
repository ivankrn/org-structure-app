import { OrganizationalUnit } from './organizational-unit.model';
import { OrganizationalUnitHierarchy } from './organizational-unit-hierarchy.model';

export interface SelectedUnit extends OrganizationalUnit {
    hierarchy?: OrganizationalUnitHierarchy;
}