import { OrganizationalUnitHierarchy } from "./organizational-unit-hierarchy.model";
import { OrganizationalUnit } from "./organizational-unit.model";
import { Project } from "./project.model";

export interface Employee {
    id: number;
    fullName: string;
    jobTitle: string;
    jobType: string;
    isVacancy: boolean;
    employmentDate: string;
    organizationalUnit?: OrganizationalUnit;
    organizationalUnitHierarchy?: OrganizationalUnitHierarchy;
    projects?: Project[];
}
