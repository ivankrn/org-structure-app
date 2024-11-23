import { Employee } from "./employee.model";
import { Location } from "./location.model";
import { OrganizationalUnitType } from "./organizational-unit-type.enum";

export interface OrganizationalUnit {
    id: number;
    name: string;
    type: OrganizationalUnitType;
    totalPositionsAmount?: number;
    vacanciesAmount?: number;
    employeesAmount?: number;
    location?: string;
    head?: Employee;
    deputy?: Employee;
    subsidiaries?: OrganizationalUnit[];
    employees?: Employee[];
    locations?: Location[];
}
