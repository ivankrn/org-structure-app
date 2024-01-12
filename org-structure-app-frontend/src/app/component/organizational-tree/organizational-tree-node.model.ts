import { OrganizationalTreeNodeType } from "./organizational-tree-node-type.enum";

export interface OrganizationalTreeNode {
    id: number;
    name: string;
    nameWithoutType: string;
    type: OrganizationalTreeNodeType;
    location?: string;
    isVacancy?: boolean;
    parent?: OrganizationalTreeNode;
    divisionName?: string;
    departmentName?: string;
    groupName?: string;
    children?: OrganizationalTreeNode[];
}