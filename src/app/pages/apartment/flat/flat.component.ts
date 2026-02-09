import { ChangeDetectorRef, Component } from '@angular/core';
import { ApartmentService } from '../apartment.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-flat',
  templateUrl: './flat.component.html',
  styleUrl: './flat.component.scss'
})
export class FlatComponent {
  role!: string | null;
  modalRef: any;
  closeResult: string;
  isAdd: boolean = false;

  addForm = new FormGroup({
    apartmentId: new FormControl("", Validators.required),
    floor: new FormControl("", Validators.required),
    rentAmount: new FormControl("", Validators.required),
    flatNumber: new FormControl("", Validators.required),
    meterNumber: new FormControl(""),
  });

  filterForm = new FormGroup({
    apartmentName: new FormControl(""),
    select_apartmentId: new FormControl(""),
  });

  adminForm = new FormGroup({
    name: new FormControl("", Validators.required),
    mobile: new FormControl("", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    password: new FormControl("123456", Validators.required),
    email: new FormControl(""),
  });

  id: any = 0;
  apartments: any;
  flats: any;
  loading = false;
  apartmentId: any;
  flatId: any;
  isMulti: boolean = false;
  isflatAdmin: boolean = false;
  flatAdminUpdate: boolean = false;
  isA_Admin: boolean = false;
  isF_Admin: boolean = false;
  apartmentName: any;

  constructor(private authState: AuthStateService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private router: Router,
    private post: ApartmentService,
    private alertService: AlertService) { }


  ngOnInit(): void {

    this.role = this.authState.getRole();
    if (this.role === 'apartment_admin') {
      this.isA_Admin = true;
      this.isF_Admin = false;
      this.getApartment();
    } else if (this.role === 'flat_admin') {
      this.isF_Admin = true;
      this.isA_Admin = false;
      //get flat details API
      this.getFlatsByFlatAdminId();
    } else {
      this.isF_Admin = false;
      this.isA_Admin = false;
      // this.router.navigate(['/auth/login'])
      this.authState.logout();
    }
  }

  openAddModal(addModal: any, id: any) {
    if (id == 0) this.isAdd = true;
    this.flatAdminUpdate = false;
    this.adminForm.controls["name"].setValue("")
    this.adminForm.controls['mobile'].setValue("")
    this.adminForm.controls['password'].setValue("123456")
    this.modalRef = this.modalService.open(addModal);
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      }, (_reason: any) => {
        this.closeResult = `Dismissed`;
      }
    )
  }

  openUpdateModal(addModal: any, id: any, data: any) {
    if (id != 0) this.isAdd = false;
    this.flatId = data._id
    this.addForm.controls["rentAmount"].setValue(data.rentAmount)
    this.addForm.controls["floor"].setValue(data.floor)
    this.addForm.controls["flatNumber"].setValue(data.flatNumber)
    this.addForm.controls['apartmentId'].setValue(data.apartmentId)
    this.addForm.controls["meterNumber"].setValue(data.meterNumber)
    if (data.flatAdminId) {
      this.flatAdminUpdate = true;
      this.adminForm.controls["name"].setValue(data.flatAdminId.name)
      this.adminForm.controls['mobile'].setValue(data.flatAdminId.mobile)
    } else {
      this.flatAdminUpdate = false;
      this.adminForm.controls["name"].setValue("")
      this.adminForm.controls['mobile'].setValue("")
    }

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
      this.getFlatsByApartmentId(this.apartmentId);

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
  getFlatsByApartmentId(apartmentId: string) {
    this.loading = true;

    this.post.getFlatByApartmentId(apartmentId).subscribe({
      next: (res) => {
        this.loading = false;

        if (!res?.data?.length) {
          this.flats = [];
          return;
        }

        this.flats = res.data;
        this.apartmentId = res.data[0]?.apartmentId;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      },
    });
  }

  /**
 * 🔹 GET BY FLAT ADMIN_ID (EDIT MODE)
 */
  getFlatsByFlatAdminId() {
    this.loading = true;

    this.post.getFlatsByFlatAdminId().subscribe({
      next: (res) => {
        this.flats = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
  /**
   * 🔹 ADD FLAT
   */
  addFlat() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = {
      apartmentId: this.addForm.value.apartmentId!,
      flatNumber: this.addForm.value.flatNumber!,
      floor: this.addForm.value.floor!,
      rentAmount: this.addForm.value.rentAmount!,
      meterNumber: this.addForm.value.meterNumber!,
    };

    this.post.addFlat(payload).subscribe({
      next: (res) => {
        if (this.isflatAdmin) {
          //add flat admin
          this.addFlatAdmin(res.flat._id);
        } else {
          this.closeModal();
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }


  /**
   * 🔹 UPDATE FLAT
   */
  updateFlat() {
    if (!this.flatId) return;

    this.loading = true;

    const payload = {
      flatNumber: this.addForm.value.flatNumber ?? undefined,
      rentAmount: this.addForm.value.rentAmount ?? undefined,
      floor: this.addForm.value.floor ?? undefined,
      meterNumber: this.addForm.value.meterNumber ?? undefined,
    };

    this.post.updateFlatById(this.flatId, payload).subscribe({
      next: (res) => {

        if (this.isflatAdmin) {
          // add/update flat admin    
          if (this.flatAdminUpdate) {
            this.updateFlatAdmin(this.flatId);
          } else {
            this.addFlatAdmin(this.flatId);
          }

        } else {
          this.closeModal();
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }


  closeModal() {
    this.getFlatsByApartmentId(this.apartmentId);
    this.isAdd = false;
    this.flatId = '';
    this.addForm.controls['rentAmount'].setValue("")
    this.addForm.controls['flatNumber'].setValue("")
    this.addForm.controls['meterNumber'].setValue("")
    this.addForm.controls['floor'].setValue("")
    this.modalRef.close('close');
    this.loading = false;
    this.isflatAdmin = false;
    this.adminForm.reset()
    this.adminForm.controls['password'].setValue("123456")
  }

  deleteFlat(flatId: any) {
    this.post.deleteFlatById(flatId).subscribe(() => {
      this.getFlatsByApartmentId(this.apartmentId);
    });

  }

  filterInTable(event: Event) {
    const apartmentId = (event.target as HTMLSelectElement).value;
    this.getFlatsByApartmentId(apartmentId);
  }

  isAddFlatAdmin() {
    this.isflatAdmin = true;
  }

  get adminMobile() {
    return this.adminForm.get('mobile')
  }

  closeAddAdminModal() {
    this.isflatAdmin = false;
    this.adminForm.reset()
    this.adminForm.controls['password'].setValue("123456")
  }

  addFlatAdmin(flat_Id: any) {

    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    const payload = {
      apartmentId: this.addForm.value.apartmentId!,
      flatId: flat_Id,
      name: this.adminForm.value.name!,
      mobile: this.adminForm.value.mobile!,
      password: this.adminForm.value.password!,
    };

    this.post.addFlatAdmin(payload).subscribe({
      next: (res) => {
        this.alertService.show("Added successfully..!")
        this.closeModal();
      },
      error: () => {
        this.loading = false;
      },
    });



  }

  updateFlatAdmin(flat_Id: any) {

    if (!flat_Id) return;

    this.loading = true;

    const payload = {
      name: this.adminForm.value.name ?? undefined,
      mobile: this.adminForm.value.mobile ?? undefined,
      email: this.adminForm.value.email ?? undefined,
    };

    this.post.updateFlatAdminByFlatId(flat_Id, payload).subscribe({
      next: (res) => {
        this.alertService.show("Updated successfully..!")
        this.closeModal();
      },
      error: () => {
        this.loading = false;
      },
    });

  }

}

