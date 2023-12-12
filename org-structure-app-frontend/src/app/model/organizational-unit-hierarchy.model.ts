import { OrganizationalUnit } from "./organizational-unit.model";

export interface OrganizationalUnitHierarchy {
    legalEntity?: OrganizationalUnit,
    division?: OrganizationalUnit,
    department?: OrganizationalUnit,
    group?: OrganizationalUnit
}
