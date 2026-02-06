
import { ChangeDetectorRef, Component } from '@angular/core';
import { ApartmentService } from '../apartment.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  role!: string | null;
  flat_ID!: string | null;
  modalRef: any;
  closeResult: string;
  isAdd: boolean = false;

  addForm = new FormGroup({
    apartmentId: new FormControl("", Validators.required),
    flatId: new FormControl(""),
    inventoryName: new FormControl(""),
    quantity: new FormControl(""),
    description: new FormControl(""),
  });

  filterForm = new FormGroup({
    apartmentName: new FormControl(""),
    select_apartmentId: new FormControl(""),
  });

  id: any = 0;
  apartments: any;
  inventoryData: any;
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
    } else if (this.role === 'flat_admin' || this.role === 'resident') {
      this.isF_Admin = true;
      this.isA_Admin = false;
      //get flat Id for API
      this.flat_ID = this.authState.getFlat();
      this.getInventoryByFlatId(this.flat_ID);
    } else {
      this.isF_Admin = false;
      this.isA_Admin = false;
      this.router.navigate(['/auth/login'])
    }
  }

  openAddModal(addModal: any, id: any) {
    if (id == 0) this.isAdd = true;
    this.flatAdminUpdate = false;
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
    this.inventoryId = data._id
    this.addForm.controls["description"].setValue(data.description)
    this.addForm.controls["flatId"].setValue(data.flatId?._id || "")
    this.addForm.controls["inventoryName"].setValue(data.itemName)
    this.addForm.controls["quantity"].setValue(data.quantity)
    this.addForm.controls["apartmentId"].setValue(data.apartmentId)

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
      this.getInventoryByApartmentId(this.apartmentId);

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
          this.flatData = [];
          return;
        }

        this.flatData = res.data;
        this.apartmentId = res.data[0]?.apartmentId;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      },
    });
  }

  /**
   * 🔹 GET BY APARTMENT ID (EDIT MODE)
   */
  getInventoryByApartmentId(apartmentId: string) {
    this.loading = true;

    this.post.getInventoryByApartment(apartmentId).subscribe({
      next: (res) => {

        if (!res?.data?.length) {
          this.inventoryData = [];
          return;
        }

        this.inventoryData = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      },
    });
  }

  /**
   * 🔹 GET BY APARTMENT ID (EDIT MODE)
   */
  getInventoryByFlatId(flat_ID: string) {
    this.loading = true;

    this.post.getInventoryByFlat(flat_ID).subscribe({
      next: (res) => {

        if (!res?.data?.length) {
          this.inventoryData = [];
          return;
        }

        this.inventoryData = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      },
    });
  }

  /**
   * 🔹 ADD INVENTORY
   */
  add() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = {
      apartmentId: this.addForm.value.apartmentId!,
      flatId: this.addForm.value.flatId!,
      itemName: this.addForm.value.inventoryName!,
      quantity: this.addForm.value.quantity!,
      description: this.addForm.value.description!,
    };

    this.post.addInventory(payload).subscribe({
      next: (res) => {
        this.closeModal();
      },
      error: () => {
        this.loading = false;
      },
    });
  }


  /**
   * 🔹 UPDATE 
   */
  update() {
    if (!this.inventoryId) return;

    this.loading = true;

    const payload = {
      flatId: this.addForm.value.flatId ?? undefined,
      itemName: this.addForm.value.inventoryName ?? undefined,
      quantity: this.addForm.value.quantity ?? undefined,
      description: this.addForm.value.description ?? undefined,
    };

    this.post.updateInventory(this.inventoryId, payload).subscribe({
      next: (res) => {
        this.closeModal();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  closeModal() {
    this.getInventoryByApartmentId(this.apartmentId);
    this.isAdd = false;
    this.inventoryId = '';
    this.addForm.controls['flatId'].setValue("")
    this.addForm.controls['inventoryName'].setValue("")
    this.addForm.controls['description'].setValue("")
    this.addForm.controls['quantity'].setValue("")
    this.modalRef.close('close');
    this.loading = false;
  }

  filterInTable(event: Event) {
    const apartmentId = (event.target as HTMLSelectElement).value;
    this.getFlatsByApartmentId(apartmentId);
  }

}