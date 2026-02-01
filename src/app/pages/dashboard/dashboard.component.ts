import { Component, OnInit } from '@angular/core';
import { ModalConfig } from '../../_metronic/partials';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  role!: string | null;
  dashboard: any;
  loading = true;

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  constructor(private authState: AuthStateService,
    private dashboardService: DashboardService,
    private router: Router) { }

  ngOnInit(): void {
    this.role = this.authState.getRole();
    if (this.role === 'super_admin') {
      this.dashboardService.getSuperAdminDashboard()
        .subscribe({
          next: (res) => {
            this.dashboard = res;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
    }

    if (this.role === 'apartment_admin') {
      this.dashboardService.getApartmentDashboard()
        .subscribe({
          next: (res) => {
            this.dashboard = res;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
    }

    if (this.role === 'flat_admin' || this.role === 'resident') {
      this.dashboardService.getFlatDashboard()
        .subscribe({
          next: (res) => {
            this.dashboard = res;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
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
      case 'verified':
        return {
          value: 1,
          label: `Rent PAID (${month}/${year})`,
          cssClass: 'bg-success',
        };

      case 'paid':
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
      case 'verified':
        return {
          value: 1,
          label: `Light Bill PAID (${month}/${year})`,
          cssClass: 'bg-success',
        };

      case 'paid':
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
