import { EmployeeStatus } from "../../../model/employee-status.enum";
import { Gender } from "../../../model/gender.enum";
import { OrganizationalTreeNodeHierarchy } from "./organizational-tree-node-hierarchy.model";
import { OrganizationalTreeNodeType } from "./organizational-tree-node-type.enum";

export interface OrganizationalTreeNode {
    id: number;
    name: string;
    nameWithoutType: string;
    type: OrganizationalTreeNodeType;
    location?: string;
    jobTitle?: string;
    jobType?: string;
    gender?: Gender;
    status?: EmployeeStatus;
    salary?: number;
    companyWorkExperienceInYears?: number;
    totalWorkExperienceInYears?: number;
    isVacancy?: boolean;
    imageUrl?: string;
    parent?: OrganizationalTreeNode;
    hierarchy?: OrganizationalTreeNodeHierarchy;
    children?: OrganizationalTreeNode[];
    head?: OrganizationalTreeNode;
}