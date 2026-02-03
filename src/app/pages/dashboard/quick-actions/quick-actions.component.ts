import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/core/services/auth-state.service';

@Component({
  selector: 'app-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrl: './quick-actions.component.scss'
})
export class QuickActionsComponent {
  role!: string | null;

  constructor(
    private authState: AuthStateService,
    private router: Router
  ) {
    this.role = this.authState.getRole();
  }

  /* =========================
     PERMISSION CHECKS
     ========================= */

  canAddAdmin(): boolean {
    return this.role === 'super_admin';
  }

  canAddComplaint(): boolean {
    return ['apartment_admin', 'flat_admin', 'resident'].includes(this.role || '');
  }

  canAddVehicle(): boolean {
    return ['apartment_admin', 'flat_admin', 'resident'].includes(this.role || '');
  }

  canAddMember(): boolean {
    return this.role === 'flat_admin';
  }

  canAddApartment(): boolean {
    return this.role === 'apartment_admin';
  }

  canAddFlat(): boolean {
    return this.role === 'apartment_admin';
  }

  canAddRent(): boolean {
    return ['apartment_admin', 'flat_admin', 'resident'].includes(this.role || '');
  }

  canAddLightBill(): boolean {
    return this.role === 'flat_admin';
  }

  /* =========================
     NAVIGATION ACTIONS
     ========================= */

  gotoAdmin(): void {
    this.router.navigate(['/users']);
  }

  gotoAddComplaint(): void {
    this.router.navigate(['/complaints/add']);
  }

  gotoAddVehicle(): void {
    this.router.navigate(['/vehicles/add']);
  }

  gotoMember(): void {
    this.router.navigate(['/apartment/my-flat']);
  }

  gotoRent(): void {
    this.router.navigate(['/payment/rent']);
  }

  gotoAddLightBill(): void {
    this.router.navigate(['/payment/light-bill']);
  }
  gotoFlat(): void {
    this.router.navigate(['/apartment/flat']);
  }

  gotoApartment(): void {
    this.router.navigate(['/apartment/profile']);
  }

  gotoComment(): void {
    this.router.navigate(['/apartment/comment']);
  }



}

