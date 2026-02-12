import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthStateService } from './core/services/auth-state.service';
import { PwaInstallService } from './services/pwa-install.service';
import { PwaUpdateService } from './services/pwa-update.service';
import { NotificationService } from './services/notification.service';

@Component({
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
    private pwaUpdateService: PwaUpdateService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.showIosInstallHint = this.pwaService.shouldShowIosHint();
    this.showAndroidInstallBtn =
      this.pwaService.isAndroid() && this.pwaService.canInstallAndroid();

    this.pwaUpdateService.init();

    // ✅ ONLY listen, DO NOT request permission here
    this.notificationService.listen();
  }

  installAndroid(): void {
    this.pwaService.installAndroid();
  }

  enableNotifications(): void {
    this.notificationService.requestPermission();
  }
}
