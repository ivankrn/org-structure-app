import { Employee } from './employee.model';

export interface Project {
    id: number;
    name: string;
    employees?: Employee[];
}