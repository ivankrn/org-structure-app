import { Injectable } from '@angular/core';
import { OrganizationalUnitService } from './organizational-unit.service';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { OrganizationalUnit } from '../model/organizational-unit.model';
import { OrganizationalUnitType } from '../model/organizational-unit-type.enum';

@Injectable({
  providedIn: 'root'
})
export class OrganizationalUnitSearchService {

  constructor(private organizationalUnitService: OrganizationalUnitService) { }

  getUnitsStream(querySubject: Subject<string>): Observable<OrganizationalUnit[]> {
    const unitsQuery: Observable<string> = querySubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    );
    return unitsQuery.pipe(
      switchMap(query => this.organizationalUnitService.findByName(query))
    );
  }

  getUnitNamesStream(type: OrganizationalUnitType, querySubject: Subject<string>): Observable<string[]> {
    const unitNamesQuery: Observable<string> = querySubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    );
    return unitNamesQuery.pipe(
      switchMap(query => this.organizationalUnitService.findByTypeNamesContaining(type, query))
    );
  }

}
