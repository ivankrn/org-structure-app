import { EmployeeStatus } from "./employee-status.enum";
import { Gender } from "./gender.enum";
import { OrganizationalUnitHierarchy } from "./organizational-unit-hierarchy.model";
import { OrganizationalUnit } from "./organizational-unit.model";
import { Project } from "./project.model";

export interface Employee {
    id: number;
    fullName: string;
    gender: Gender;
    jobTitle: string;
    jobType: string;
    email: string;
    isVacancy: boolean;
    status?: EmployeeStatus;
    employmentDate: string;
    organizationalUnit?: OrganizationalUnit;
    organizationalUnitHierarchy?: OrganizationalUnitHierarchy;
    projects?: Project[];
    salary?: number;
    totalYearsExperience?: number;
}
