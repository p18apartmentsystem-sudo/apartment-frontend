import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  monthYearList: { month: string; year: number }[] = [];

generateMonthYearArray() {
  const result: {
    month: string;   // ✅ string now
    year: number;
    monthYr: string;
  }[] = [];

  const startMonth = 5; // June (0-based)
  const startYear = 2025;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  let year = startYear;
  let monthIndex = startMonth;

  while (
    year < currentYear ||
    (year === currentYear && monthIndex <= currentMonth)
  ) {
    result.push({
      month: months[monthIndex],              // ✅ Jan, Feb, …
      year: year,
      monthYr: `${months[monthIndex]} ${year}`
    });

    monthIndex++;
    if (monthIndex > 11) {
      monthIndex = 0;
      year++;
    }
  }

  // Latest first
  return result.reverse();
}



  /**
 * 🔹 ADD RENT
 */
addRent(payload: {
  month: string;
  year: string;
  amount: string;
  refno: string;
  proofFile: File;
}): Observable<any> {

  const formData = new FormData();
  formData.append('month', payload.month);
  formData.append('year', payload.year);
  formData.append('amount', payload.amount);
  formData.append('refno', payload.refno);
  formData.append('proofFile', payload.proofFile); // 🔥 KEY LINE

  return this.http.post(
    `${this.baseUrl}/rent-payments`,
    formData
  );
}


  /**
   * GET RENT for FLAT
   */
  getRentForFlat(): Observable<any> {
    return this.http.get(`${this.baseUrl}/rent-payments/flat`);
  }

  /**
   * GET APARMENTS
   */
  getApartment(): Observable<any> {
    return this.http.get(`${this.baseUrl}/apartments/`);
  }
  
  /**
   * GET RENT for APARTMENT
   * status: uploaded (default) | paid | rejected
   */
  getRentByApartment(
    id: string,
    status: 'uploaded' | 'paid' | 'rejected' = 'uploaded'
  ): Observable<any> {

    const params = new HttpParams().set('status', status);

    return this.http.get(
      `${this.baseUrl}/rent-payments/apartment/${id}`,
      { params }
    );
  }

  /**
   * VERIFY RENT
   */
  verifyRent(
    id: string,
    payload: {
      status?: string;
    }
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/rent-payments/verify/${id}`,
      payload
    );
  }


  /**
   * GET DOC RENT for FLAT
   */
  getDocRentForFlat(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/rent-payments/${id}`);
  }

    /**
   * GET FLAT
   */
  getFlatsByFlatAdminId(): Observable<any> {
    return this.http.get(`${this.baseUrl}/flats/`);
  }

  
}