import { Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';
import { Employee } from '../model/employee.model';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSearchService {

  constructor(private employeeService: EmployeeService) { }

  getUnitsStream(querySubject: Subject<string>): Observable<Employee[]> {
    const unitsQuery: Observable<string> = querySubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    );
    return unitsQuery.pipe(
      switchMap(query => this.employeeService.findByName(query))
    );
  }
}
