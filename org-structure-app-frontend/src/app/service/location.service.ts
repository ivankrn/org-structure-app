import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '../model/location.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private endpoint: string = "locations";
  private apiUrl: string = environment.apiUrl + this.endpoint;

  constructor(private httpClient: HttpClient) { }

  public findAll(): Observable<Location[]> {
    return this.httpClient.get<Location[]>(this.apiUrl);
  }
  
}
