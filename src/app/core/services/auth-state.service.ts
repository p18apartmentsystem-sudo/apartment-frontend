import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  constructor(
    private http: HttpClient
  ) { }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  getFlat(): string | null {
    const user = this.getUser();
    return user?.flatId?.id || null;
  }

  getApartment(): string | null {
    const user = this.getUser();
    return user?.apartmentId || null;
  }

  logout(): void {
    const token = localStorage.getItem('fcm_token');

    if (token) {
      this.http.post(
        `${environment.apiUrl}/push-token/disable`,
        { token }
      ).subscribe();
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('fcm_token'); // 🔥 important

    window.location.href = '/auth/login';
  }




}
