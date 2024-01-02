import { FilterMenuSettings } from "../../filter-menu/filter-menu-settings.model";
import { OrganizationalTreeNodeType } from "../organizational-tree-node-type.enum";
import { OrganizationalTreeNode } from "../organizational-tree-node.model";
import { hasChildrenWithName } from "./organizational-tree-util";

export function filterTreeDataFromSettings(treeData: OrganizationalTreeNode, filterSettings?: FilterMenuSettings): OrganizationalTreeNode {
    if (!filterSettings) {
        return treeData;
    }
    let data: OrganizationalTreeNode = JSON.parse(JSON.stringify(treeData));
    if (!data.children) {
        return data;
    }
    data.children = data.children.filter(node => {
        if (node.type === OrganizationalTreeNodeType.LOCATION && !filterSettings.locations[node.name]) {
            return false;
        } else {
            if (node.location && !filterSettings.locations[node.location]) {
                return false;
            }

            if (node.type === OrganizationalTreeNodeType.LOCATION) {
                return true;
            }

        }
        if (node.type === OrganizationalTreeNodeType.EMPLOYEE) {
            if (filterSettings.displayNotVacancies && filterSettings.displayVacancies) {
                return true;
            } else if (filterSettings.displayNotVacancies) {
                return !node.isVacancy;
            } else if (filterSettings.displayVacancies) {
                return node.isVacancy;
            } else {
                return false;
            }
        }

        const selectedDivisions = Object.entries(filterSettings.divisions)
            .filter(entry => entry[1])
            .map(entry => entry[0]);
        if (selectedDivisions.length > 0) {
            if (node.divisionName === undefined) {
                return false;
            }
            const divisionName = node.divisionName.substring(node.divisionName.indexOf("\"") + 1, node.divisionName.lastIndexOf("\""));
            if (!filterSettings.divisions[divisionName]) {
                return false;
            }
        }
        const selectedDepartments = Object.entries(filterSettings.departments)
            .filter(entry => entry[1])
            .map(entry => entry[0]);
        if (selectedDepartments.length > 0) {
            if (node.type !== OrganizationalTreeNodeType.DEPARTMENT) {
                for (const selectedDepartment of selectedDepartments) {
                    if (hasChildrenWithName(node, selectedDepartment)) {
                        return true;
                    }
                }
                return false;
            }
            if (node.departmentName === undefined) {
                return false;
            }
            const departmentName = node.departmentName.substring(node.departmentName.indexOf("\"") + 1, node.departmentName.lastIndexOf("\""));
            if (!filterSettings.departments[departmentName]) {
                return false;
            }
        }
        const selectedGroups = Object.entries(filterSettings.groups)
            .filter(entry => entry[1])
            .map(entry => entry[0]);
        if (selectedGroups.length > 0) {
            if (node.type !== OrganizationalTreeNodeType.GROUP) {
                for (const selectedGroup of selectedGroups) {
                    if (hasChildrenWithName(node, selectedGroup)) {
                        return true;
                    }
                }
                return false;
            }
            if (node.groupName === undefined) {
                return false;
            }
            const groupName = node.groupName.substring(node.groupName.indexOf("\"") + 1, node.groupName.lastIndexOf("\""));
            if (!filterSettings.groups[groupName]) {
                return false;
            }
        }

        return true;
    });
    for (let i = 0; i < data.children.length; i++) {
        data.children[i] = filterTreeDataFromSettings(data.children[i], filterSettings);
    }
    return data;
}