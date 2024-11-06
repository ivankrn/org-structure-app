import { JobTitleStatistic } from './job-title-statistic.model';

export interface OrganizationUnitAggregation {
    totalPositionsAmount: number;
    employeesAmount: number;
    vacanciesAmount: number;
    totalWageFund: number;
    jobTitlesStatistics: JobTitleStatistic[];
}