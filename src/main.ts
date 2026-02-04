import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {
    // 🔄 Force SW update check every 30 mins
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        setInterval(() => {
          registration.update();
        }, 30 * 60 * 1000);
      });
    }
  })
  .catch((err) => console.error(err));
