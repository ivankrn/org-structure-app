import { FilterMenuSettings } from "../../../filter-menu/filter-menu-settings.model";
import { OrganizationalTreeNodeType } from "../../model/organizational-tree-node-type.enum";
import { OrganizationalTreeNode } from "../../model/organizational-tree-node.model";
import { hasChildrenWithId } from "../organizational-tree-util";

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
        const selectedLocations: string[] = Object.entries(filterSettings.locations)
            .filter(entry => entry[1])
            .map(entry => entry[0]);
        if (selectedLocations.length > 0) {
            if (node.type === OrganizationalTreeNodeType.LOCATION) {
                if (!node.id || !node.name) {
                    return false;
                }

                return filterSettings.locations[node.id + '_' + node.name];
            } else if (node.location && !selectedLocations.some((location: string) => location.includes(node.location!))) {
                return false;
            }
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
            if (!filterSettings.displayNotVacancies && !filterSettings.displayVacancies) {
                return false;
            }
            if (!(filterSettings.displayNotVacancies && filterSettings.displayVacancies)) {
                if (filterSettings.displayVacancies && !node.isVacancy) {
                    return false;
                }
                if (filterSettings.displayNotVacancies && node.isVacancy) {
                    return false;
                }
            }

            const selectedJobTitles: String[] = Object.entries(filterSettings.jobTitles)
                .filter(entry => entry[1])
                .map(entry => entry[0]);
            if (selectedJobTitles.length > 0 && !selectedJobTitles.includes(node.jobTitle!)) {
                return false;
            }

            const selectedJobTypes: String[] = Object.entries(filterSettings.jobTypes)
                .filter(entry => entry[1])
                .map(entry => entry[0]);
            if (selectedJobTypes.length > 0 && !selectedJobTypes.includes(node.jobType!)) {
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
        const isOrganizationalStructure = node.type === OrganizationalTreeNodeType.DIVISION
            || node.type === OrganizationalTreeNodeType.DEPARTMENT || node.type === OrganizationalTreeNodeType.GROUP;
        if (!isOrganizationalStructure) {
            if (this.nextFilter !== undefined) {
                return this.nextFilter.isValid(node, filterSettings);
            }
            return true;
        }
        const selectedDivisions = Object.entries(filterSettings.divisions)
            .filter(entry => entry[1])
            .map(entry => entry[0]);
        if (selectedDivisions.length > 0) {
            if (node.id === undefined) {
                return false;
            }

            if (!filterSettings.divisions[node.id.toString()]) {
                return false;
            }
        }
        const selectedDepartments = Object.entries(filterSettings.departments)
            .filter(entry => entry[1])
            .map(entry => entry[0]);
        if (selectedDepartments.length > 0) {
            if (node.type === OrganizationalTreeNodeType.DIVISION) {
                for (const selectedDepartment of selectedDepartments) {
                    if (hasChildrenWithId(node, selectedDepartment)) {
                        return true;
                    }
                }
                return false;
            } else if (node.type === OrganizationalTreeNodeType.DEPARTMENT || node.type === OrganizationalTreeNodeType.GROUP) {
                if (node.id === undefined) {
                    return false;
                }

                if (!filterSettings.departments[node.id.toString()]) {
                    return false;
                }
            }
        }
        const selectedGroups = Object.entries(filterSettings.groups)
            .filter(entry => entry[1])
            .map(entry => entry[0]);
        if (selectedGroups.length > 0) {
            if (node.type === OrganizationalTreeNodeType.DIVISION || node.type === OrganizationalTreeNodeType.DEPARTMENT) {
                for (const selectedGroup of selectedGroups) {
                    if (hasChildrenWithId(node, selectedGroup)) {
                        return true;
                    }
                }
                return false;
            } else if (node.type === OrganizationalTreeNodeType.GROUP) {
                if (node.id === undefined) {
                    return false;
                }

                if (!filterSettings.groups[node.id.toString()]) {
                    return false;
                }
            }
        }
        if (this.nextFilter !== undefined) {
            return this.nextFilter.isValid(node, filterSettings);
        }
        return true;
    }

}