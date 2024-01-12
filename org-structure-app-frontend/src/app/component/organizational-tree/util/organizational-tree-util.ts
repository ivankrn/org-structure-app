import { OrganizationalUnitType } from "../../../model/organizational-unit-type.enum";
import { OrganizationalUnit } from "../../../model/organizational-unit.model";
import { OrganizationalTreeNodeType } from "../organizational-tree-node-type.enum";
import { OrganizationalTreeNode } from "../organizational-tree-node.model";

// export function convertUnitGroupedByLocations(organizationalUnit: OrganizationalUnit): OrganizationalTreeNode {
//     const node: OrganizationalTreeNode = {
//         id: organizationalUnit.id,
//         name: getUnitNameWithType(organizationalUnit),
//         nameWithoutType: organizationalUnit.name,
//         type: OrganizationalTreeNodeType[OrganizationalUnitType[organizationalUnit.type]],
//         children: []
//     };
//     organizationalUnit.locations?.forEach(location => {
//         const locationChild: OrganizationalTreeNode = {
//             id: location.id,
//             name: location.name,
//             nameWithoutType: location.name,
//             type: OrganizationalTreeNodeType.LOCATION,
//             children: []
//         };
//         location.subsidiaries?.forEach(subsidiary => {
//             const newSubsidiary: OrganizationalTreeNode = {
//                 id: subsidiary.id,
//                 name: getUnitNameWithType(subsidiary),
//                 nameWithoutType: subsidiary.name,
//                 type: OrganizationalTreeNodeType[OrganizationalUnitType[subsidiary.type]],
//                 location: subsidiary.location
//             };
//             locationChild.children?.push(newSubsidiary);
//         });
//         node.children?.push(locationChild);
//     });
//     return node;
// }

// export function convertUnit(organizationalUnit: OrganizationalUnit): OrganizationalTreeNode {
//     const node: OrganizationalTreeNode = {
//         id: organizationalUnit.id,
//         name: getUnitNameWithType(organizationalUnit),
//         nameWithoutType: organizationalUnit.name,
//         type: OrganizationalTreeNodeType[OrganizationalUnitType[organizationalUnit.type]],
//         children: []
//     };
//     organizationalUnit.subsidiaries?.forEach(subsidiary => {
//         const newSubsidiary: OrganizationalTreeNode = {
//             id: subsidiary.id,
//             name: getUnitNameWithType(subsidiary),
//             nameWithoutType: subsidiary.name,
//             type: OrganizationalTreeNodeType[OrganizationalUnitType[subsidiary.type]]
//         };
//         node.children?.push(newSubsidiary);
//     });
//     organizationalUnit.employees?.forEach(employee => {
//         const newEmployee: OrganizationalTreeNode = {
//             id: employee.id,
//             name: employee.fullName,
//             nameWithoutType: employee.fullName,
//             type: OrganizationalTreeNodeType.EMPLOYEE,
//             isVacancy: employee.isVacancy
//         };
//         node.children?.push(newEmployee);
//     });
//     return node;
// }

export function convertUnitGroupedByLocations(organizationalUnit: OrganizationalUnit): OrganizationalTreeNode {
    const node: OrganizationalTreeNode = {
        id: organizationalUnit.id,
        name: getUnitNameWithType(organizationalUnit),
        nameWithoutType: organizationalUnit.name,
        type: OrganizationalTreeNodeType[OrganizationalUnitType[organizationalUnit.type]],
        children: []
    };
    updateNodeParentName(node, node);
    organizationalUnit.locations?.forEach(location => {
        const locationChild: OrganizationalTreeNode = {
            id: location.id,
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
            updateNodeParentName(locationChild, newSubsidiary);
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
            nameWithoutType: parent.name,
            type: parent.type,
            parent: parent.parent
        };
    }
    node.parent = parent;
    updateNodeParentName(node.parent!, node);
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
        updateNodeParentName(node, newSubsidiary);
        node.children?.push(newSubsidiary);
    });
    organizationalUnit.employees?.forEach(employee => {
        const newEmployee: OrganizationalTreeNode = {
            id: employee.id,
            name: employee.fullName,
            nameWithoutType: employee.fullName,
            type: OrganizationalTreeNodeType.EMPLOYEE,
            isVacancy: employee.isVacancy,
            parent: nodeWithoutChildren
        };
        updateNodeParentName(node, newEmployee);
        node.children?.push(newEmployee);
    });
    return node;
}

function updateNodeParentName(parent: OrganizationalTreeNode, node: OrganizationalTreeNode): void {
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
        updateNodeParentName(parent?.parent, node);
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

export function hasChildrenWithName(unit: OrganizationalTreeNode, name: string): boolean {
    if (!unit.children) {
        return false;
    }
    let has = false;
    for (const child of unit.children) {
        if (child.nameWithoutType === name) {
            has = true;
            return has;
        }
        has = hasChildrenWithName(child, name);
        if (has) {
            return has;
        }
    }
    return has;
}