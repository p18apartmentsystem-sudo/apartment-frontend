import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {

  constructor(private swUpdate: SwUpdate) {}

  init(): void {
    if (!this.swUpdate.isEnabled) return;

    // 🔄 Listen for new version
    this.swUpdate.versionUpdates.subscribe((event) => {
      if (event.type === 'VERSION_READY') {
        this.showUpdatePrompt();
      }
    });
  }

  private showUpdatePrompt(): void {
    const shouldReload = confirm(
      '🚀 New update available!\n\nReload to get the latest version?'
    );

    if (shouldReload) {
      this.swUpdate.activateUpdate().then(() => {
        document.location.reload();
      });
    }
  }
}
