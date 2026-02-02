import { ChangeDetectorRef, Component } from '@angular/core';
import { ApartmentService } from '../apartment.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  role!: string | null;
  modalRef: any;
  closeResult: string;
  isAdd: boolean = false;

  addForm = new FormGroup({
    name: new FormControl("", Validators.required),
    address: new FormControl("", Validators.required),
    address_lg: new FormControl(""),
  });

  id: any = 0;
  apartments: any;
  loading = false;
  apartmentId: any;

  constructor(private authState: AuthStateService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private router: Router,
    private post: ApartmentService) { }


  ngOnInit(): void {

    this.role = this.authState.getRole();
    if (this.role === 'apartment_admin') {
      this.getApartment();
    } else {
      this.router.navigate(['/auth/login'])
    }
  }

  openAddModal(addModal: any, id: any) {
    if (id == 0) this.isAdd = true;

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
    this.apartmentId = data._id
    this.addForm.controls["name"].setValue(data.name)
    this.addForm.controls["address"].setValue(data.address)
    this.addForm.controls["address_lg"].setValue(data.address_lg)

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
    this.post.getApartment().subscribe(res => {
      this.apartments = res.data;
    });

  }

  /**
 * 🔹 GET BY ID (EDIT MODE)
 */
  getApartmentById(apartmentId: string) {
    this.loading = true;

    this.post.getApartmentById(apartmentId).subscribe({
      next: (res) => {

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }


  /**
   * 🔹 ADD APARTMENT
   */
  addApartment() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = {
      name: this.addForm.value.name!,
      address: this.addForm.value.address!,
      address_lg: this.addForm.value.address_lg!,
    };

    this.post.addApartment(payload).subscribe({
      next: () => {
        this.closeModal();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }


  /**
   * 🔹 UPDATE APARTMENT
   */
  updateApartment() {
    if (!this.apartmentId) return;

    this.loading = true;

    const payload = {
      name: this.addForm.value.name ?? undefined,
      address: this.addForm.value.address ?? undefined,
      address_lg: this.addForm.value.address_lg ?? undefined,
    };

    this.post.updateApartmentById(this.apartmentId, payload).subscribe({
      next: () => {
        alert("Updated successfully..!")
        this.closeModal();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }


  closeModal() {
    this.getApartment();
    this.isAdd = false;
    this.apartmentId = '';
    this.addForm.reset()
    this.addForm.controls['name'].setValue("")
    this.addForm.controls['address'].setValue("")
    this.addForm.controls["address_lg"].setValue("")
    this.modalRef.close('close');
  }

  deleteApartment(apartmentId: any) {
    this.post.deleteApartmentById(apartmentId).subscribe(() => {
      this.getApartment();
    });

  }

}
