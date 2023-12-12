import { OrganizationalUnit } from "./organizational-unit.model";

export interface Location {
    id: number;
    name: string;
    subsidiaries?: OrganizationalUnit[];
}
