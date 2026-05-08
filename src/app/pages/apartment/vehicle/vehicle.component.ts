import { ChangeDetectorRef, Component } from '@angular/core';
import { ApartmentService } from '../apartment.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent {
  role!: string | null;
  modalRef: any;
  closeResult: string;
  isAdd: boolean = false;

  addForm = new FormGroup({
    apartmentId: new FormControl(""),
    vehicleNumber: new FormControl(""),
    vehicleType: new FormControl("2W"),
    description: new FormControl(""),
  });

  filterForm = new FormGroup({
    apartmentName: new FormControl(""),
    select_apartmentId: new FormControl(""),
  });

  apartments: any;
  vehicleData: any;
  flatData: any;
  loading = false;
  apartmentId: any;
  inventoryId: any;
  isMulti: boolean = false;
  isflatAdmin: boolean = false;
  flatAdminUpdate: boolean = false;
  isA_Admin: boolean = false;
  isF_Admin: boolean = false;
  apartmentName: any;

  constructor(private authState: AuthStateService,
    private modalService: NgbModal,
    private post: ApartmentService,
    private cd: ChangeDetectorRef,) { }


  ngOnInit(): void {

    this.role = this.authState.getRole();
    if (this.role === 'apartment_admin') {
      this.isA_Admin = true;
      this.isF_Admin = false;
      this.getApartment();
    } else if (this.role === 'flat_admin' || this.role === 'resident') {
      this.isF_Admin = true;
      this.isA_Admin = false;
      this.getVehicleByFlat();
    } else {
      this.isF_Admin = false;
      this.isA_Admin = false;
      // this.router.navigate(['/auth/login'], { replaceUrl: true })
      this.authState.logout();
    }
  }

  openAddModal(addModal: any) {
    this.modalRef = this.modalService.open(addModal);
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      }, (_reason: any) => {
        this.closeResult = `Dismissed`;
      }
    )
  }


  getApartment() {
    this.isMulti = false;
    this.post.getApartment().subscribe(res => {
      this.apartments = res.data;
      this.apartmentId = res.data[0]._id;
      this.getVehicleByApartmentId(this.apartmentId);

      if (res.data.length > 1) {
        this.isMulti = true;
        this.filterForm.controls['select_apartmentId'].setValue(res.data[0]._id)
      } else {
        this.isMulti = false;
        this.apartmentName = res.data[0].name
        this.addForm.controls['apartmentId'].setValue(this.apartmentId)
      }
    });

  }

  /**
   * 🔹 GET BY APARTMENT ID (EDIT MODE)
   */
  getVehicleByApartmentId(apartmentId: string) {
    this.loading = true;

    this.post.getVehicleByApartment(apartmentId).subscribe({
      next: (res) => {

        if (!res?.data?.length) {
          this.vehicleData = [];
          return;
        }

        this.vehicleData = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      },
    });
  }

  /**
   * 🔹 GET BY FLAT
   */
  getVehicleByFlat() {
    this.loading = true;

    this.post.getVehicleByFlat().subscribe({
      next: (res) => {

        if (!res?.data?.length) {
          this.vehicleData = [];
          return;
        }

        this.vehicleData = res.data;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      },
    });
  }

  /**
   * 🔹 ADD VEHICLE
   */
  add() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = {
      vehicleType: this.addForm.value.vehicleType!,
      vehicleNumber: this.addForm.value.vehicleNumber!,
      description: this.addForm.value.description!,
    };

    this.post.addVehicle(payload).subscribe({
      next: () => {
        this.getVehicleByFlat();
        this.closeModal();
      },
      error: () => {
        this.loading = false;
      },
    });
  }


  closeModal() {
    this.addForm.controls['vehicleNumber'].setValue("")
    this.addForm.controls['vehicleType'].setValue("2W")
    this.addForm.controls['description'].setValue("")
    this.modalRef.close('close');
    this.loading = false;
  }

}
