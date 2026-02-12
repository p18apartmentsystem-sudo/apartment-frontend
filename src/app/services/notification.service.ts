import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private isTokenSaving = false;

  constructor(
    private afMessaging: AngularFireMessaging,
    private http: HttpClient
  ) { }

  /**
   * Called from dashboard after login
   */
  checkAndHandlePermission(): 'show-banner' | 'auto-save' | 'nothing' {
    const permission = Notification.permission;

    if (permission === 'default') {
      return 'show-banner';
    }

    if (permission === 'granted') {
      const savedToken = localStorage.getItem('fcm_token');
      if (!savedToken) {
        return 'auto-save';
      }
    }

    return 'nothing';
  }

  requestPermission(): void {
    if (this.isTokenSaving) return;

    this.afMessaging.requestToken.subscribe({
      next: (token) => {
        if (!token) return;

        const savedToken = localStorage.getItem('fcm_token');
        if (savedToken === token) return;

        localStorage.setItem('fcm_token', token);

        this.isTokenSaving = true;
        this.saveTokenToBackend(token);
      },
      error: (err) => {
        console.error('Permission denied', err);
        this.isTokenSaving = false;
      }
    });
  }

  private saveTokenToBackend(token: string): void {
    const payload = {
      token,
      platform: this.getPlatform()
    };

    this.http.post(
      `${environment.apiUrl}/push-token/save`,
      payload
    ).subscribe({
      next: () => {
        console.log('Token saved to backend');
        this.isTokenSaving = false;
      },
      error: () => {
        this.isTokenSaving = false;
      }
    });
  }

  listen(): void {
    this.afMessaging.messages.subscribe(message => {
      console.log('Foreground notification:', message);
    });
  }

  private getPlatform(): 'web' | 'android' | 'ios' {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    if (/android/.test(ua)) return 'android';
    return 'web';
  }
}
