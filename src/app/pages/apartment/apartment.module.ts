import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalsModule } from '../../_metronic/partials';
import { ApartmentComponent } from './apartment.component';
import { ProfileComponent } from './profile/profile.component';
import { FlatComponent } from './flat/flat.component';
import { ParkingSlotComponent } from './parking-slot/parking-slot.component';
import { CrudModule } from 'src/app/modules/crud/crud.module';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { ApartmentRoutingModule } from './apartment-routing.module';
import { ComplaintComponent } from './complaint/complaint.component';
import { FlatAdminComponent } from './flat/flat-admin/flat-admin.component';
import { InventoryComponent } from './inventory/inventory.component';
import { VehicleComponent } from './vehicle/vehicle.component';

@NgModule({
  declarations: [
    ProfileComponent,
    FlatComponent,
    ParkingSlotComponent,
    ComplaintComponent,
    FlatAdminComponent,
    InventoryComponent,
    VehicleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ApartmentComponent,
      },
    ]),
    CrudModule,
    SharedModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    SweetAlert2Module.forChild(),
    WidgetsModule,
    ModalsModule,
    ApartmentRoutingModule
  ],
})
export class ApartmentModule { }
