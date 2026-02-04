import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthStateService } from './core/services/auth-state.service';
import { PwaInstallService } from './services/pwa-install.service';
import { PwaUpdateService } from './services/pwa-update.service';

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  showIosInstallHint = false;
  showAndroidInstallBtn = false;

  constructor(
    private authState: AuthStateService,
    public pwaService: PwaInstallService,
    private pwaUpdateService: PwaUpdateService
  ) {}

  ngOnInit(): void {
    // 🔹 Existing logic
    this.showIosInstallHint = this.pwaService.shouldShowIosHint();
    this.showAndroidInstallBtn =
      this.pwaService.isAndroid() && this.pwaService.canInstallAndroid();

    // 🔥 NEW: check for PWA updates
    this.pwaUpdateService.init();
  }

  installAndroid(): void {
    this.pwaService.installAndroid();
  }
}
