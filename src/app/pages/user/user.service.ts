import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private baseUrl = environment.apiUrl; // e.g. http://localhost:3000/api

  constructor(private http: HttpClient) {}

  /**
   * 🔹 CREATE APARTMENT ADMIN
   * (Super Admin)
   */
  addAdmin(payload: {
    name: string;
    mobile: string;
    password: string;
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/super-admin/add-admin`,
      payload
    );
  }

  /**
   * 🔹 1️⃣ GET ALL ADMINS (DESC)
   */
  getAllAdmins(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/super-admin/admins`
    );
  }

  /**
   * 🔹 2️⃣ GET ADMIN BY ID
   */
  getAdminById(adminId: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/super-admin/admin/${adminId}`
    );
  }

  /**
   * 🔹 3️⃣ UPDATE ADMIN BY ID
   */
  updateAdminById(
    adminId: string,
    payload: {
      name?: string;
      mobile?: string;
      apartmentId?: string;
    }
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/super-admin/admin/${adminId}`,
      payload
    );
  }

  /**
   * 🔹 4️⃣ DELETE ADMIN (SOFT DELETE)
   */
  deleteAdminById(adminId: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/super-admin/admin/${adminId}`
    );
  }

    // Get my profile
  getMyProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/me`);
  }

  // Update email
  updateEmail(email: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile/update-email`, { email });
  }

  // Send email OTP
  sendEmailOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/profile/send-email-otp`, { email });
  }

  // Verify email OTP
  verifyEmailOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/profile/verify-email-otp`, { email, otp });
  }

    // ✅ Update Profile
  updateMyProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile/me`, data);
  }
}
