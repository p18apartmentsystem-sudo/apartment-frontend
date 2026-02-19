import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {

  constructor(private swUpdate: SwUpdate) {}

  init(): void {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates.subscribe(event => {
      if (event.type === 'VERSION_READY') {
        // 🔥 silently update without confirm popup
        this.swUpdate.activateUpdate().then(() => {
          document.location.reload();
        });
      }
    });
  }
}
