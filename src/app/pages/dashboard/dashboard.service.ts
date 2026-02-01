import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private baseUrl = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) {}

  /**
   * SUPER ADMIN DASHBOARD
   */
  getSuperAdminDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/super-admin`);
  }

  /**
   * APARTMENT ADMIN DASHBOARD
   */
  getApartmentDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/apartment`);
  }

  /**
   * FLAT / RESIDENT DASHBOARD
   */
  getFlatDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/flat`);
  }
}
