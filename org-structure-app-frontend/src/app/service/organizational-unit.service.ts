import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OrganizationalUnit } from '../model/organizational-unit.model';
import { OrganizationalUnitHierarchy } from '../model/organizational-unit-hierarchy.model';
import { environment } from '../../environments/environment';
import { OrganizationalUnitType } from '../model/organizational-unit-type.enum';
import { OrganizationUnitAggregation } from '../model/organization-unit-aggregation.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationalUnitService {

  private endpoint: string = "organizational-units";
  private apiUrl: string = environment.apiUrl + this.endpoint;

  private httpClient: HttpClient = inject(HttpClient);

  public findById(id: number): Observable<OrganizationalUnit> {
    return this.httpClient.get<OrganizationalUnit>(this.apiUrl + "/" +id);
  }

  public findByTypeGroupedByLocation(type: OrganizationalUnitType): Observable<OrganizationalUnit[]> {
    return this.httpClient.get<OrganizationalUnit[]>(`${this.apiUrl}?type=${type}&group-by=location`);
  }
  
  public findByName(name: string): Observable<OrganizationalUnit[]> {
    return this.httpClient.get<OrganizationalUnit[]>(`${this.apiUrl}?name=${name}`);
  }

  public findByTypeNamesContaining(type: OrganizationalUnitType, text: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.apiUrl}/names?type=${type}&name=${text}`);
  }

  public findUnitHierarchy(unitId: number): Observable<OrganizationalUnitHierarchy> {
    return this.httpClient.get<OrganizationalUnitHierarchy>(`${this.apiUrl}/${unitId}/hierarchy`);
  }

  public findNamesByTypes(): Observable<Map<string, string[]>> {
    return this.httpClient.get<Map<string, string[]>>(`${this.apiUrl}/names`);
  }

  public aggregateByIds(ids: number[]): Observable<OrganizationUnitAggregation> {
    if (!ids?.length) {
      return of({
        totalPositionsAmount: 0,
        employeesAmount: 0,
        vacanciesAmount: 0,
        totalWageFund: 0,
        jobTitlesStatistics: [],
      })
    }

    const queryParamsArray: string[] = ids.map((id: number)=> `ids=${id}`);
    const queryParamsString: string = queryParamsArray.join('&');

    return this.httpClient.get<OrganizationUnitAggregation>(`${this.apiUrl}/aggregation?${queryParamsString}`);
  }
}
