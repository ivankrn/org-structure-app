import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../model/employee.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private endpoint: string = "employees";
  private apiUrl: string = environment.apiUrl + this.endpoint;

  constructor(private httpClient: HttpClient) { }

  public findById(id: number): Observable<Employee> {
    return this.httpClient.get<Employee>(this.apiUrl + "/" +id);
  }
  
  public findByName(name: string): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.apiUrl}?name=${name}`);
  }
  
}
