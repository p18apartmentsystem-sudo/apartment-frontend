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
  aprtment!: string | null;

  constructor(
    private authState: AuthStateService,
    private router: Router
  ) {
    this.role = this.authState.getRole();
    this.aprtment = this.authState.getApartment();
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

  canAddFlatRent(): boolean {
    return this.role === 'apartment_admin';
  }

  canAddFlat(): boolean {
    return this.role === 'apartment_admin';
  }

  canAddApartment(): boolean {
    if (!this.aprtment) {
      return this.role === 'apartment_admin';
    }
  }

  canAddRent(): boolean {
    return ['apartment_admin', 'flat_admin', 'resident'].includes(this.role || '');
  }

  canInventory(): boolean {
    return ['apartment_admin', 'flat_admin', 'resident'].includes(this.role || '');
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

  gotoApartment(): void {
    this.router.navigate(['/apartment/profile']);
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

  gotoFlatRent(): void {
    this.router.navigate(['/payment/flat-rent']);
  }

  gotoComment(): void {
    this.router.navigate(['/apartment/updates']);
  }

  gotoInventory(): void {
    this.router.navigate(['/apartment/inventory']);
  }

  gotoLightBill(): void {
    this.router.navigate(['/payment/light-bill']);
  }

  gotoFlatLightBill(): void {
    this.router.navigate(['/payment/flat-light-bill']);
  }


}

