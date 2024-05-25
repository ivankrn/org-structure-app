import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../model/project.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    private endpoint: string = "projects";
    private apiUrl: string = environment.apiUrl + this.endpoint;

    private httpClient: HttpClient = inject(HttpClient);

    public findById(id: number): Observable<Project> {
        return this.httpClient.get<Project>(this.apiUrl + "/" +id);
    }

    public findByName(name: string): Observable<Project[]> {
        return this.httpClient.get<Project[]>(`${this.apiUrl}?name=${name}`);
    }
}