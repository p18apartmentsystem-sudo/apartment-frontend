import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';
import { ApartmentComponent } from './apartment.component';
import { ProfileComponent } from './profile/profile.component';
import { FlatComponent } from './flat/flat.component';
import { ParkingSlotComponent } from './parking-slot/parking-slot.component';
import { FlatAdminComponent } from './flat/flat-admin/flat-admin.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { InventoryComponent } from './inventory/inventory.component';
import { VehicleComponent } from './vehicle/vehicle.component';

const routes: Routes = [
    {
        path: '',
        component: ApartmentComponent,
        canActivate: [RoleGuard],
        data: {
            roles: ['super_admin', 'apartment_admin']
        }
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [RoleGuard],
        data: {
            roles: ['apartment_admin']
        }
    },

    {
        path: 'flat',
        component: FlatComponent,
        canActivate: [RoleGuard],
        data: {
            roles: ['apartment_admin']
        }
    },

    {
        path: 'my-flat',
        component: FlatAdminComponent,
        canActivate: [RoleGuard],
        data: {
            roles: ['apartment_admin', 'flat_admin', 'resident']
        }
    },

    {
        path: 'parking',
        component: ParkingSlotComponent,
        canActivate: [RoleGuard],
        data: {
            roles: ['apartment_admin']
        }
    },
    {
        path: 'updates',
        component: ComplaintComponent,
        canActivate: [RoleGuard],
        data: {
            roles: ['apartment_admin', 'flat_admin', 'resident']
        }
    },

    {
        path: 'inventory',
        component: InventoryComponent,
        canActivate: [RoleGuard],
        data: {
            roles: ['apartment_admin', 'flat_admin', 'resident']
        }
    },

    {
        path: 'vehicle',
        component: VehicleComponent,
        canActivate: [RoleGuard],
        data: {
            roles: ['apartment_admin', 'flat_admin', 'resident']
        }
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApartmentRoutingModule { }
