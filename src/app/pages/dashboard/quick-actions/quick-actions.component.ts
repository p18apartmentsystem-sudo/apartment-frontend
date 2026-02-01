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

  constructor(private authState: AuthStateService,
    private router: Router
  ) {
    this.role = this.authState.getRole(); // example method
  }

  canAddAdmin(): boolean {
    return this.role === 'super_admin' || this.role === 'apartment_admin';
  }

  canAddComplaint(): boolean {
    return true; // all roles
  }

  canAddVehicle(): boolean {
    return this.role === 'resident';
  }

  canAddMember(): boolean {
    return this.role === 'apartment_admin';
  }

  gotoAdmin(){  
    if(this.role === 'super_admin') this.router.navigate(['/users']);
    if(this.role === 'apartment_admin') this.router.navigate(['/users/flat']);
  }
}

