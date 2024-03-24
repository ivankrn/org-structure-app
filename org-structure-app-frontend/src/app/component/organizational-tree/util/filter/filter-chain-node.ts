import { FilterMenuSettings } from "../../../filter-menu/filter-menu-settings.model";
import { OrganizationalTreeNodeType } from "../../model/organizational-tree-node-type.enum";
import { OrganizationalTreeNode } from "../../model/organizational-tree-node.model";
import { hasChildrenWithName } from "../organizational-tree-util";

export abstract class FilterChainNode {

    protected _nextFilter?: FilterChainNode;

    public get nextFilter(): FilterChainNode | undefined {
        return this._nextFilter;
    }

    public set nextFilter(filter: FilterChainNode) {
        this._nextFilter = filter;
    }

    abstract isValid(node: OrganizationalTreeNode, filterSettings: FilterMenuSettings): boolean;

}

export class LocationFilterChainNode extends FilterChainNode {

    isValid(node: OrganizationalTreeNode, filterSettings: FilterMenuSettings): boolean {
        if (node.type === OrganizationalTreeNodeType.LOCATION) {
            return filterSettings.locations[node.name];
        } else if (node.location && !filterSettings.locations[node.location]) {
            return false;
        }
        if (this.nextFilter !== undefined) {
            return this.nextFilter.isValid(node, filterSettings);
        }
        return true;
    }

}

export class EmployeeFilterChainNode extends FilterChainNode {

    isValid(node: OrganizationalTreeNode, filterSettings: FilterMenuSettings): boolean {
        if (node.type === OrganizationalTreeNodeType.EMPLOYEE) {
            if (filterSettings.displayNotVacancies && filterSettings.displayVacancies) {
                return true;
            } else if (filterSettings.displayNotVacancies) {
                return !node.isVacancy;
            } else if (filterSettings.displayVacancies) {
                return node.isVacancy!;
            } else {
                return false;
            }
        }
        if (this.nextFilter !== undefined) {
            return this.nextFilter.isValid(node, filterSettings);
        }
        return true;
    }

}

export class UnitHierarchyFilterChainNode extends FilterChainNode {

    isValid(node: OrganizationalTreeNode, filterSettings: FilterMenuSettings): boolean {
        const selectedDivisions = Object.entries(filterSettings.divisions)
            .filter(entry => entry[1])
            .map(entry => entry[0]);
        if (selectedDivisions.length > 0) {
            if (node.hierarchy?.divisionName === undefined) {
                return false;
            }
            const divisionName = node.hierarchy.divisionName;
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
            if (node.hierarchy?.departmentName === undefined) {
                return false;
            }
            const departmentName = node.hierarchy.departmentName;
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
            if (node.hierarchy?.groupName === undefined) {
                return false;
            }
            const groupName = node.hierarchy?.groupName;
            if (!filterSettings.groups[groupName]) {
                return false;
            }
        }
        if (this.nextFilter !== undefined) {
            return this.nextFilter.isValid(node, filterSettings);
        }
        return true;
    }

}