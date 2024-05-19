export interface FilterMenuSettings {
    locations: Map<string, boolean>;
    divisions: Map<string, boolean>;
    departments: Map<string, boolean>;
    groups: Map<string, boolean>;
    jobTitles: Map<string, boolean>;
    jobTypes: Map<string, boolean>;
    displayVacancies: boolean;
    displayNotVacancies: boolean;
}
