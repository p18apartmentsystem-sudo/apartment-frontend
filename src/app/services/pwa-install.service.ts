import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaInstallService {
  private deferredPrompt: any = null;

  constructor() {
    // Android / Desktop Chrome install
    window.addEventListener('beforeinstallprompt', (event: any) => {
      event.preventDefault();
      this.deferredPrompt = event;
    });
  }

  /* ---------- Platform Detection ---------- */

  isIos(): boolean {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  }

  isAndroid(): boolean {
    return /android/i.test(window.navigator.userAgent);
  }

  /* ---------- Installed Detection ---------- */

  isStandalone(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  }

  /* ---------- Android Install ---------- */

  canInstallAndroid(): boolean {
    return !!this.deferredPrompt;
  }

  async installAndroid(): Promise<void> {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
  }

  /* ---------- iOS Install Hint ---------- */

  shouldShowIosHint(): boolean {
    return this.isIos() && !this.isStandalone();
  }
}
