import { OrganizationalUnitHierarchy } from "./organizational-unit-hierarchy.model";
import { OrganizationalUnit } from "./organizational-unit.model";

export interface Employee {
    id: number;
    fullName: string;
    jobTitle: string;
    jobType: string;
    isVacancy: boolean;
    organizationalUnit?: OrganizationalUnit;
    organizationalUnitHierarchy?: OrganizationalUnitHierarchy;
    projects?: Array<{ id: number, name: string }>;
}
