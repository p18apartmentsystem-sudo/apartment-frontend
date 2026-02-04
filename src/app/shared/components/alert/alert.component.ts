import { Component, OnInit } from '@angular/core';
import { AlertService, AlertData } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  alert: AlertData | null = null;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.alert$.subscribe(alert => {
      this.alert = alert;
    });
  }

  close() {
    this.alertService.close();
  }
}
