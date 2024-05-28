import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobType } from '../model/job-type.model';

@Injectable({
    providedIn: 'root'
})
export class JobTypeService {

    private endpoint: string = "job-types";
    private apiUrl: string = environment.apiUrl + this.endpoint;

    private httpClient: HttpClient = inject(HttpClient);

    public findAll(): Observable<JobType[]> {
        return this.httpClient.get<[]>(this.apiUrl);
    }

    public findById(id: number): Observable<JobType> {
        return this.httpClient.get<JobType>(this.apiUrl + "/" +id);
    }

    public findByName(name: string): Observable<JobType[]> {
        return this.httpClient.get<JobType[]>(`${this.apiUrl}?name=${name}`);
    }
}