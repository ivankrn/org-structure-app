import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobTitle } from '../model/job-title.model';

@Injectable({
    providedIn: 'root'
})
export class JobTitleService {

    private endpoint: string = "job-titles";
    private apiUrl: string = environment.apiUrl + this.endpoint;

    private httpClient: HttpClient = inject(HttpClient);

    public findAll(): Observable<JobTitle[]> {
        return this.httpClient.get<[]>(this.apiUrl);
    }

    public findById(id: number): Observable<JobTitle> {
        return this.httpClient.get<JobTitle>(this.apiUrl + "/" +id);
    }

    public findByName(name: string): Observable<JobTitle[]> {
        return this.httpClient.get<JobTitle[]>(`${this.apiUrl}?name=${name}`);
    }
}