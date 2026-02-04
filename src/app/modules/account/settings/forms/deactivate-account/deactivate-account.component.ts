import { Component } from '@angular/core';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-deactivate-account',
  templateUrl: './deactivate-account.component.html',
})
export class DeactivateAccountComponent {
  constructor(private alertService: AlertService) {}

  saveSettings() {
    this.alertService.show('Account has been successfully deleted!');
  }
}
