import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MissingFlat {
  flat: string;
  flatAdminName: string | null;
  flatAdminMobile: string | null;
}

export interface PendingPaymentsResponse {
  rent: MissingFlat[];
  lightBills: MissingFlat[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPendingPayments(month: string, year: number)
    : Observable<PendingPaymentsResponse> {

    const params = new HttpParams()
      .set('month', month)
      .set('year', year.toString());

    return this.http.get<PendingPaymentsResponse>(
      `${this.baseUrl}/reports/pending-payments`,
      { params }
    );
  }
}