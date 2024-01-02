import { OrganizationalUnitType } from "../../model/organizational-unit-type.enum";
import { OrganizationalUnit } from "../../model/organizational-unit.model";
import { OrganizationalTreeNodeType } from "./organizational-tree-node-type.enum";

export class OrganizationalTreeNode {
    id!: number;
    name!: string;
    nameWithoutType!: string;
    type!: OrganizationalTreeNodeType;
    location?: string;
    isVacancy?: boolean;
    parent?: OrganizationalTreeNode;
    divisionName?: string;
    departmentName?: string;
    groupName?: string;
    children?: OrganizationalTreeNode[];

    constructor(id?: number, name?: string, nameWithoutType?: string, type?: OrganizationalTreeNodeType,
        organizationalUnit?: OrganizationalUnit, treeData?: OrganizationalTreeNode) {
        if (organizationalUnit === undefined) {
            this.id = id!;
            this.name = name!;
            this.nameWithoutType = nameWithoutType!;
            this.type = type!;
        } else {
            if (organizationalUnit.locations !== undefined) {
                return OrganizationalTreeNode.convertUnitGroupedByLocations(organizationalUnit);
            }
            return OrganizationalTreeNode.convertUnit(treeData!, organizationalUnit);
        }
    }

    public hasChildrenWithName(name: string): boolean {
        if (this.children === undefined) {
            return false;
        }
        let has = false;
        for (const child of this.children) {
            if (child.nameWithoutType === name) {
                has = true;
                return has;
            }
            has = child.hasChildrenWithName(name);
        }
        return has;
    }

    private static convertUnitGroupedByLocations(organizationalUnit: OrganizationalUnit): OrganizationalTreeNode {
        const node = new OrganizationalTreeNode(
            organizationalUnit.id, 
            OrganizationalTreeNode.getUnitNameWithType(organizationalUnit),
            organizationalUnit.name,
            OrganizationalTreeNodeType[OrganizationalUnitType[organizationalUnit.type]]
            );
        node.children = [];
        // const node: OrganizationalTreeNode = {
        //     id: organizationalUnit.id,
        //     name: OrganizationalTreeNode.getUnitNameWithType(organizationalUnit),
        //     nameWithoutType: organizationalUnit.name,
        //     type: OrganizationalTreeNodeType[OrganizationalUnitType[organizationalUnit.type]],
        //     children: [],
        //     hasChildrenWithName: OrganizationalTreeNode.prototype.hasChildrenWithName
        // };
        OrganizationalTreeNode.updateNodeParentName(node, node);
        organizationalUnit.locations?.forEach(location => {
            const locationChild = new OrganizationalTreeNode(
                location.id,
                location.name,
                location.name,
                OrganizationalTreeNodeType.LOCATION
            );
            locationChild.children = [];
            // const locationChild: OrganizationalTreeNode = {
            //     id: location.id,
            //     name: location.name,
            //     nameWithoutType: location.name,
            //     type: OrganizationalTreeNodeType.LOCATION,
            //     children: [],
            //     hasChildrenWithName: OrganizationalTreeNode.prototype.hasChildrenWithName
            // };
            location.subsidiaries?.forEach(subsidiary => {
                const newSubsidiary = new OrganizationalTreeNode(
                    subsidiary.id,
                    OrganizationalTreeNode.getUnitNameWithType(subsidiary),
                    subsidiary.name,
                    OrganizationalTreeNodeType[OrganizationalUnitType[subsidiary.type]]
                );
                newSubsidiary.location = subsidiary.location;
                newSubsidiary.children = [];
                // const newSubsidiary: OrganizationalTreeNode = {
                //     id: subsidiary.id,
                //     name: OrganizationalTreeNode.getUnitNameWithType(subsidiary),
                //     nameWithoutType: subsidiary.name,
                //     type: OrganizationalTreeNodeType[OrganizationalUnitType[subsidiary.type]],
                //     location: subsidiary.location,
                //     hasChildrenWithName: OrganizationalTreeNode.prototype.hasChildrenWithName
                // };
                OrganizationalTreeNode.updateNodeParentName(locationChild, newSubsidiary);
                locationChild.children?.push(newSubsidiary);
            });
            node.children?.push(locationChild);
        });
        return node;
    }

    private static convertUnit(treeData: OrganizationalTreeNode, organizationalUnit: OrganizationalUnit): OrganizationalTreeNode {
        const node = new OrganizationalTreeNode(
            organizationalUnit.id, 
            OrganizationalTreeNode.getUnitNameWithType(organizationalUnit),
            organizationalUnit.name,
            OrganizationalTreeNodeType[OrganizationalUnitType[organizationalUnit.type]]
            );
        node.children = [];
        let parent = OrganizationalTreeNode.getUnitParentInTree(treeData!, node);
        if (parent?.children) {
            parent = new OrganizationalTreeNode(
                parent.id,
                parent.name,
                parent.nameWithoutType,
                parent.type
            );
            parent.parent = parent.parent;
            // parent = {
            //     id: parent.id,
            //     name: parent.name,
            //     nameWithoutType: parent.name,
            //     type: parent.type,
            //     parent: parent.parent,
            //     hasChildrenWithName: OrganizationalTreeNode.prototype.hasChildrenWithName
            // };
        }
        node.parent = parent;
        OrganizationalTreeNode.updateNodeParentName(node.parent!, node);
        const nodeWithoutChildren = new OrganizationalTreeNode(
            organizationalUnit.id,
            OrganizationalTreeNode.getUnitNameWithType(organizationalUnit),
            organizationalUnit.name,
            OrganizationalTreeNodeType[OrganizationalUnitType[organizationalUnit.type]]
        );
        // const nodeWithoutChildren: OrganizationalTreeNode = {
        //     id: organizationalUnit.id,
        //     name: OrganizationalTreeNode.getUnitNameWithType(organizationalUnit),
        //     nameWithoutType: organizationalUnit.name,
        //     type: OrganizationalTreeNodeType[OrganizationalUnitType[organizationalUnit.type]],
        //     hasChildrenWithName: OrganizationalTreeNode.prototype.hasChildrenWithName
        // };
        organizationalUnit.subsidiaries?.forEach(subsidiary => {
            const newSubsidiary = new OrganizationalTreeNode(
                subsidiary.id,
                OrganizationalTreeNode.getUnitNameWithType(subsidiary),
                subsidiary.name,
                OrganizationalTreeNodeType[OrganizationalUnitType[subsidiary.type]]
            );
            newSubsidiary.parent = nodeWithoutChildren;
            // const newSubsidiary: OrganizationalTreeNode = {
            //     id: subsidiary.id,
            //     name: OrganizationalTreeNode.getUnitNameWithType(subsidiary),
            //     nameWithoutType: subsidiary.name,
            //     type: OrganizationalTreeNodeType[OrganizationalUnitType[subsidiary.type]],
            //     parent: nodeWithoutChildren,
            //     hasChildrenWithName: OrganizationalTreeNode.prototype.hasChildrenWithName
            // };
            OrganizationalTreeNode.updateNodeParentName(node, newSubsidiary);
            node.children?.push(newSubsidiary);
        });
        organizationalUnit.employees?.forEach(employee => {
            const newEmployee = new OrganizationalTreeNode(
                employee.id,
                employee.fullName,
                employee.fullName,
                OrganizationalTreeNodeType.EMPLOYEE
            );
            newEmployee.isVacancy = true;
            newEmployee.parent = nodeWithoutChildren;
            // const newEmployee: OrganizationalTreeNode = {
            //     id: employee.id,
            //     name: employee.fullName,
            //     nameWithoutType: employee.fullName,
            //     type: OrganizationalTreeNodeType.EMPLOYEE,
            //     isVacancy: employee.isVacancy,
            //     parent: nodeWithoutChildren,
            //     hasChildrenWithName: OrganizationalTreeNode.prototype.hasChildrenWithName
            // };
            OrganizationalTreeNode.updateNodeParentName(node, newEmployee);
            node.children?.push(newEmployee);
        });
        return node;
    }

    private static updateNodeParentName(parent: OrganizationalTreeNode, node: OrganizationalTreeNode): void {
        switch (parent?.type) {
            case OrganizationalTreeNodeType.DIVISION: {
                node.divisionName = parent.name;
                break;
            }
            case OrganizationalTreeNodeType.DEPARTMENT: {
                node.departmentName = parent.name;
                break;
            }
            case OrganizationalTreeNodeType.GROUP: {
                node.groupName = parent.name;
                break;
            }
        }
        switch (node?.type) {
            case OrganizationalTreeNodeType.DIVISION: {
                node.divisionName = node.name;
                break;
            }
            case OrganizationalTreeNodeType.DEPARTMENT: {
                node.departmentName = node.name;
                break;
            }
            case OrganizationalTreeNodeType.GROUP: {
                node.groupName = node.name;
                break;
            }
        }
        if (parent?.parent) {
            OrganizationalTreeNode.updateNodeParentName(parent?.parent, node);
        }
    }


    private static getUnitParentInTree(root: OrganizationalTreeNode, unit: OrganizationalTreeNode): OrganizationalTreeNode | undefined {
        if (!root.children) {
            return undefined;
        }
        if (root.children.filter(node => node.id === unit.id).length > 0) {
            return root;
        }
        for (const child of root.children) {
            const parent = OrganizationalTreeNode.getUnitParentInTree(child, unit);
            if (parent !== undefined) {
                return parent;
            }
        }
        return undefined;
    }

    private static getUnitNameWithType(unit: OrganizationalUnit): string {
        let type: string = "";
        switch (unit.type) {
            case OrganizationalUnitType.LEGAL_ENTITY: {
                type = "Юр.лицо";
                break;
            }
            case OrganizationalUnitType.DIVISION: {
                type = "Подразделение";
                break;
            }
            case OrganizationalUnitType.DEPARTMENT: {
                type = "Отдел";
                break;
            }
            case OrganizationalUnitType.GROUP: {
                type = "Группа";
                break;
            }
        }
        return `${type} "${unit.name}"`;
    }

}