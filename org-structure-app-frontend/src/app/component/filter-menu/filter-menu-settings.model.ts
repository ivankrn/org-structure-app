export class FilterMenuSettings {
    locations: Map<string, boolean>;
    divisions: Map<number, boolean>;
    departments: Map<number, boolean>;
    groups: Map<number, boolean>;
    jobTitles: Map<string, boolean>;
    jobTypes: Map<string, boolean>;
    displayVacancies: boolean;
    displayNotVacancies: boolean;

    selectedDivisionsIds(): number[] {
        return Object.entries(this.divisions)
            .filter(entry => entry[1])
            .map(entry => Number.parseInt(entry[0]));
    }

    selectedDepartmentsIds(): number[] {
        return Object.entries(this.departments)
            .filter(entry => entry[1])
            .map(entry => Number.parseInt(entry[0]));
    }

    selectedGroupsIds(): number[] {
        return Object.entries(this.groups)
            .filter(entry => entry[1])
            .map(entry => Number.parseInt(entry[0]));
    }
}
