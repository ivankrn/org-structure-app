import { CompanyWorkExperience } from "../../model/company-work-experience.enum";
import { EmployeeStatus } from "../../model/employee-status.enum";
import { Gender } from "../../model/gender.enum";

export class FilterMenuSettings {
    locations: Map<string, boolean>;
    divisions: Map<number, boolean>;
    departments: Map<number, boolean>;
    groups: Map<number, boolean>;
    jobTitles: Map<string, boolean>;
    jobTypes: Map<string, boolean>;
    displayVacancies: boolean;
    displayNotVacancies: boolean;
    minSalary: number;
    maxSalary: number;
    companyWorkExperience: CompanyWorkExperience;
    totalWorkExperience: CompanyWorkExperience;
    status: EmployeeStatus;
    genders: Map<Gender, boolean>;

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

    minTotalWorkExperienceInYears(): number {
        switch (this.totalWorkExperience) {
            case CompanyWorkExperience.DOES_NOT_MATTER:
                return 0;
            case CompanyWorkExperience.LESS_THAN_ONE_YEAR:
                return 0;
            case CompanyWorkExperience.FROM_ONE_TO_THREE_YEARS:
                return 1;
            case CompanyWorkExperience.FROM_THREE_TO_SIX_YEARS:
                return 3;
            case CompanyWorkExperience.MORE_THAN_SIX_YEARS:
                return 6;
        }
    }

    maxTotalWorkExperienceInYears(): number {
        switch (this.totalWorkExperience) {
            case CompanyWorkExperience.DOES_NOT_MATTER:
                return Number.POSITIVE_INFINITY;
            case CompanyWorkExperience.LESS_THAN_ONE_YEAR:
                return 1;
            case CompanyWorkExperience.FROM_ONE_TO_THREE_YEARS:
                return 3;
            case CompanyWorkExperience.FROM_THREE_TO_SIX_YEARS:
                return 6;
            case CompanyWorkExperience.MORE_THAN_SIX_YEARS:
                return Number.POSITIVE_INFINITY;
        }
    }

    minCompanyWorkExperienceInYears(): number {
        switch (this.companyWorkExperience) {
            case CompanyWorkExperience.DOES_NOT_MATTER:
                return 0;
            case CompanyWorkExperience.LESS_THAN_ONE_YEAR:
                return 0;
            case CompanyWorkExperience.FROM_ONE_TO_THREE_YEARS:
                return 1;
            case CompanyWorkExperience.FROM_THREE_TO_SIX_YEARS:
                return 3;
            case CompanyWorkExperience.MORE_THAN_SIX_YEARS:
                return 6;
        }
    }

    maxCompanyWorkExperienceInYears(): number {
        switch (this.companyWorkExperience) {
            case CompanyWorkExperience.DOES_NOT_MATTER:
                return Number.POSITIVE_INFINITY;
            case CompanyWorkExperience.LESS_THAN_ONE_YEAR:
                return 1;
            case CompanyWorkExperience.FROM_ONE_TO_THREE_YEARS:
                return 3;
            case CompanyWorkExperience.FROM_THREE_TO_SIX_YEARS:
                return 6;
            case CompanyWorkExperience.MORE_THAN_SIX_YEARS:
                return Number.POSITIVE_INFINITY;
        }
    }
}
