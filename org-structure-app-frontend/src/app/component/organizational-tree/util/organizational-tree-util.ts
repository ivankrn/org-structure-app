import { OrganizationalUnitType } from "../../../model/organizational-unit-type.enum";
import { OrganizationalUnit } from "../../../model/organizational-unit.model";
import { OrganizationalTreeNodeType } from "../model/organizational-tree-node-type.enum";
import { OrganizationalTreeNode } from "../model/organizational-tree-node.model";
import { Project } from '../../../model/project.model';
import { Location } from '../../../model/location.model';

export function convertUnitGroupedByLocations(organizationalUnit: OrganizationalUnit, locations: Location[]): OrganizationalTreeNode {
    const node: OrganizationalTreeNode = {
        id: organizationalUnit.id,
        name: getUnitNameWithType(organizationalUnit),
        nameWithoutType: organizationalUnit.name,
        type: OrganizationalTreeNodeType[OrganizationalUnitType[organizationalUnit.type]],
        children: []
    };
    updateNodeHierarchy(node, node);
    organizationalUnit.locations?.forEach(location => {
        const id = locations.find((loc: Location) => loc.name === location.name)!.id;
        const locationChild: OrganizationalTreeNode = {
            id: id,
            name: location.name,
            nameWithoutType: location.name,
            type: OrganizationalTreeNodeType.LOCATION,
            children: []
        };
        location.subsidiaries?.forEach(subsidiary => {
            const newSubsidiary: OrganizationalTreeNode = {
                id: subsidiary.id,
                name: getUnitNameWithType(subsidiary),
                nameWithoutType: subsidiary.name,
                type: OrganizationalTreeNodeType[OrganizationalUnitType[subsidiary.type]],
                location: subsidiary.location
            };
            updateNodeHierarchy(locationChild, newSubsidiary);
            locationChild.children?.push(newSubsidiary);
        });
        node.children?.push(locationChild);
    });
    return node;
}

export function convertUnit(treeData: OrganizationalTreeNode, organizationalUnit: OrganizationalUnit): OrganizationalTreeNode {
    const node: OrganizationalTreeNode = {
        id: organizationalUnit.id, 
        name: getUnitNameWithType(organizationalUnit),
        nameWithoutType: organizationalUnit.name,
        type: OrganizationalTreeNodeType[OrganizationalUnitType[organizationalUnit.type]]
    };
    node.children = [];
    let parent = getUnitParentInTree(treeData!, node);
    if (parent?.children) {
        parent = {
            id: parent.id,
            name: parent.name,
            nameWithoutType: parent.nameWithoutType,
            type: parent.type,
            parent: parent.parent
        };
    }
    node.parent = parent;
    updateNodeHierarchy(node.parent!, node);
    const nodeWithoutChildren: OrganizationalTreeNode = {
        id: organizationalUnit.id,
        name: getUnitNameWithType(organizationalUnit),
        nameWithoutType: organizationalUnit.name,
        type: OrganizationalTreeNodeType[OrganizationalUnitType[organizationalUnit.type]]
    };
    organizationalUnit.subsidiaries?.forEach(subsidiary => {
        const newSubsidiary: OrganizationalTreeNode = {
            id: subsidiary.id,
            name: getUnitNameWithType(subsidiary),
            nameWithoutType: subsidiary.name,
            type: OrganizationalTreeNodeType[OrganizationalUnitType[subsidiary.type]],
            parent: nodeWithoutChildren
        };
        updateNodeHierarchy(node, newSubsidiary);
        node.children?.push(newSubsidiary);
    });
    organizationalUnit.employees?.forEach(employee => {
        const newEmployee: OrganizationalTreeNode = {
            id: employee.id,
            name: employee.fullName,
            nameWithoutType: employee.fullName,
            type: OrganizationalTreeNodeType.EMPLOYEE,
            jobTitle: employee.jobTitle,
            jobType: employee.jobType,
            isVacancy: employee.isVacancy,
            parent: nodeWithoutChildren
        };
        updateNodeHierarchy(node, newEmployee);
        node.children?.push(newEmployee);
    });
    return node;
}

export function convertProject(project: Project): OrganizationalTreeNode {
    const node: OrganizationalTreeNode = {
        id: project.id,
        name: `Проект "${project.name}"`,
        nameWithoutType: project.name,
        type: OrganizationalTreeNodeType.PROJECT
    };
    node.children = [];
    const nodeWithoutChildren: OrganizationalTreeNode = {
        id: node.id,
        name: node.name,
        nameWithoutType: node.nameWithoutType,
        type: OrganizationalTreeNodeType.PROJECT
    }
    project.employees?.forEach(employee => {
        const newEmployee: OrganizationalTreeNode = {
            id: employee.id,
            name: employee.fullName,
            nameWithoutType: employee.fullName,
            type: OrganizationalTreeNodeType.EMPLOYEE,
            jobTitle: employee.jobTitle,
            jobType: employee.jobType,
            isVacancy: employee.isVacancy,
            parent: nodeWithoutChildren
        };
        updateNodeHierarchy(node, newEmployee);
        node.children?.push(newEmployee);
    });
    return node;
}

function updateNodeHierarchy(parent: OrganizationalTreeNode, node: OrganizationalTreeNode): void {
    if (node.hierarchy === undefined) {
        node.hierarchy = {};
    }
    switch (parent?.type) {
        case OrganizationalTreeNodeType.DIVISION: {
            node.hierarchy.divisionName = parent.nameWithoutType;
            break;
        }
        case OrganizationalTreeNodeType.DEPARTMENT: {
            node.hierarchy.departmentName = parent.nameWithoutType;
            break;
        }
        case OrganizationalTreeNodeType.GROUP: {
            node.hierarchy.groupName = parent.nameWithoutType;
            break;
        }
    }
    switch (node?.type) {
        case OrganizationalTreeNodeType.DIVISION: {
            node.hierarchy.divisionName = node.nameWithoutType;
            break;
        }
        case OrganizationalTreeNodeType.DEPARTMENT: {
            node.hierarchy.departmentName = node.nameWithoutType;
            break;
        }
        case OrganizationalTreeNodeType.GROUP: {
            node.hierarchy.groupName = node.nameWithoutType;
            break;
        }
    }
    if (parent?.parent) {
        updateNodeHierarchy(parent?.parent, node);
    }
}

function getUnitParentInTree(root: OrganizationalTreeNode, unit: OrganizationalTreeNode): OrganizationalTreeNode | undefined {
    if (!root.children) {
        return undefined;
    }
    if (root.children.filter(node => node.id === unit.id).length > 0) {
        return root;
    }
    for (const child of root.children) {
        const parent = getUnitParentInTree(child, unit);
        if (parent !== undefined) {
            return parent;
        }
    }
    return undefined;
}

function getUnitNameWithType(unit: OrganizationalUnit): string {
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

export function hasChildrenWithId(unit: OrganizationalTreeNode, id: string): boolean {
    if (!unit.children) {
        return false;
    }
    let has = false;
    for (const child of unit.children) {
        if (child.id.toString() === id) {
            has = true;
            return has;
        }
        has = hasChildrenWithId(child, id);
        if (has) {
            return has;
        }
    }
    return has;
}