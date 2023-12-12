import { Employee } from "./employee.model";
import { Location } from "./location.model";
import { OrganizationalUnitType } from "./organizational-unit-type.enum";

export interface OrganizationalUnit {
    id: number;
    name: string;
    type: OrganizationalUnitType;
    location?: string;
    head?: Employee;
    subsidiaries?: OrganizationalUnit[];
    employees?: Employee[];
    locations?: Location[];
}
