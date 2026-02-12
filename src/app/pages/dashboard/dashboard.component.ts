import { Component, OnInit } from '@angular/core';
import { ModalConfig } from '../../_metronic/partials';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  role!: string | null;
  dashboard: any;
  loading = true;
  showNotificationBanner = false;

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  errorMessage: string;
  constructor(
    private authState: AuthStateService,
    private dashboardService: DashboardService,
    private router: Router,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    this.role = this.authState.getRole();
    this.getDashboard();

    // 🔔 Notification logic
    const action = this.notificationService.checkAndHandlePermission();

    if (action === 'show-banner') {
      this.showNotificationBanner = true;
    }

    if (action === 'auto-save') {
      this.notificationService.requestPermission();
    }

    this.notificationService.listen();
  }

  enableNotifications(): void {
    this.notificationService.requestPermission();
    this.showNotificationBanner = false;
  }


  getDashboard() {
    this.loading = true;

    let api$;

    if (this.role === 'super_admin') {
      api$ = this.dashboardService.getSuperAdminDashboard();
    } else if (this.role === 'apartment_admin') {
      api$ = this.dashboardService.getApartmentDashboard();
    } else if (this.role === 'flat_admin' || this.role === 'resident') {
      api$ = this.dashboardService.getFlatDashboard();
    }

    if (!api$) {
      this.loading = false;
      return;
    }

    api$.subscribe({
      next: (res) => {
        this.dashboard = res;
        this.errorMessage = null;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;

        // 🔥 MAIN LOGIC
        if (err.status === 400) {
          this.handleDashboardValidationError(err.error);
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }

  handleDashboardValidationError(error: any) {
    switch (error?.code) {

      case 'APARTMENT_NOT_ASSIGNED':
        this.errorMessage = 'Please assign an apartment to access dashboard.';
        break;

      case 'FLAT_NOT_ASSIGNED':
        this.errorMessage = 'You are not assigned to any flat yet.';
        break;

      default:
        this.errorMessage = error?.message || 'Invalid request';
    }
  }



  get freeParking(): number {
    if (!this.dashboard) return 0;
    return (
      this.dashboard.systemStats.parkingSlotsTotal -
      this.dashboard.systemStats.parkingSlotsUsed
    );
  }

  get systemHealthScore(): number {
    if (!this.dashboard) return 0;

    return this.dashboard.summary.pendingComplaints === 0 ? 100 : 50;
  }

  get systemHealthLabel(): string {
    return this.dashboard.summary.pendingComplaints === 0
      ? 'Healthy System'
      : 'Needs Attention';
  }

  get rentStatus(): { value: number; label: string; cssClass: string } {
    if (!this.dashboard?.rent) {
      return {
        value: 0,
        label: 'Rent: Not Generated',
        cssClass: 'bg-secondary',
      };
    }

    const { status, month, year } = this.dashboard.rent;

    switch (status) {
      case 'paid':
        return {
          value: 1,
          label: `Rent PAID (${month}/${year})`,
          cssClass: 'bg-success',
        };

      case 'uploaded':
        return {
          value: 1,
          label: `Rent Paid (Waiting Verification) (${month}/${year})`,
          cssClass: 'bg-warning',
        };

      case 'rejected':
        return {
          value: 0,
          label: `Rent Rejected (${month}/${year})`,
          cssClass: 'bg-danger',
        };

      default:
        return {
          value: 0,
          label: 'Rent Status Unknown',
          cssClass: 'bg-secondary',
        };
    }
  }


  get lightBillStatus(): { value: number; label: string; cssClass: string } {
    if (!this.dashboard?.lightBill) {
      return {
        value: 0,
        label: 'Light Bill: Not Uploaded',
        cssClass: 'bg-secondary',
      };
    }

    const { status, month, year } = this.dashboard.lightBill;

    switch (status) {
      case 'paid':
        return {
          value: 1,
          label: `Light Bill PAID (${month}/${year})`,
          cssClass: 'bg-success',
        };

      case 'uploaded':
        return {
          value: 1,
          label: `Light Bill Paid (Waiting Verification) (${month}/${year})`,
          cssClass: 'bg-warning',
        };

      case 'rejected':
        return {
          value: 0,
          label: `Light Bill Rejected (${month}/${year})`,
          cssClass: 'bg-danger',
        };

      default:
        return {
          value: 0,
          label: 'Light Bill Status Unknown',
          cssClass: 'bg-secondary',
        };
    }
  }

  goTo(path: string, queryParams: any = {}) {
    this.router.navigate([path], { queryParams });
  }

}
