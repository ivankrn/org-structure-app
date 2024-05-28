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
    isVacancy?: boolean;
    parent?: OrganizationalTreeNode;
    hierarchy?: OrganizationalTreeNodeHierarchy;
    children?: OrganizationalTreeNode[];
}