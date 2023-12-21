import { OrganizationalTreeNodeType } from "./organizational-tree-node-type.enum";

export interface OrganizationalTreeNode {
    id: number;
    name: string;
    type: OrganizationalTreeNodeType;
    location?: string;
    isVacancy?: boolean;
    children?: OrganizationalTreeNode[];
}