import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStateService {

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') ;
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  getApartment(): string | null {
    const user = this.getUser();
    return user?.apartmentId || null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }



}
