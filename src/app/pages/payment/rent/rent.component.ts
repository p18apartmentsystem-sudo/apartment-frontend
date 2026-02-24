import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { PaymentService } from '../payment.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html',
  styleUrl: './rent.component.scss'
})
export class RentComponent {
  role!: string | null;
  modalRef: any;
  closeResult: string;

  paymentForm = new FormGroup({
    selected_month: new FormControl(""),
    selected_year: new FormControl(""),
    amount: new FormControl(""),
    refNo: new FormControl(""),
    monthYear: new FormControl(""),
    proofFile: new FormControl("")
  });
  filterForm = new FormGroup({
    apartmentName: new FormControl(""),
    select_apartmentId: new FormControl(""),
  });

  loading = false;
  isF_Admin: boolean = false;
  isA_Admin: boolean = false;
  proofFile!: File;
  apartment_Id: any;
  apartment_name: any;
  flat: any;
  rents: any;
  apartments: any;
  isMulti: boolean = false;
  apartmentName: any;

  proofUrl: string | null = null;
  proofType: 'image' | 'pdf' | null = null;

  month: {
    month: string;
    year: number;
    monthYr: string;
  }[] = [];
  flatNumber: any;
  floor: any;
  rentAmount: any;
  rent_id: any;
  is_resident: boolean = false;
  status: any;

  constructor(private authState: AuthStateService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private router: Router,
    private post: PaymentService,
    private alertService: AlertService) { }


  ngOnInit(): void {
    this.loading = true;
    this.role = this.authState.getRole();
    if (this.role === 'apartment_admin') {
      this.isA_Admin = true;
      //get APARTMENT details API
      this.getApartment();
    } else if (this.role === 'flat_admin') {
      this.isF_Admin = true;
      //get flat details API
      this.getRentForFlat();
      this.month = this.post.generateMonthYearArray();
      this.setCurrentMonthYear();
      this.getFlatsByFlatAdminId();
    } else if (this.role === 'resident') {
      this.is_resident = true;
      this.getRentForFlat();
    } else {
      this.isF_Admin = false;
      this.isA_Admin = false;
      this.is_resident = false;
      // this.router.navigate(['/auth/login'], { replaceUrl: true })
      this.authState.logout();
    }
  }

  openAddModal(addModal: any) {
    this.paymentForm.controls['amount'].setValue(this.rentAmount)
    this.paymentForm.controls['refNo'].setValue("")
    this.modalRef = this.modalService.open(addModal);
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      }, (_reason: any) => {
        this.closeResult = `Dismissed`;
      }
    )
  }

  /**
 * 🔹 GET BY FLAT RENT
 */
  getRentForFlat() {
    this.loading = true;

    this.post.getRentForFlat().subscribe({
      next: (res) => {
        if (!res?.data?.length) {
          this.rents = [];
          this.paymentForm.controls["amount"].setValue('')
          this.loading = false;
          return;
        }
        this.rents = res.data;
        this.paymentForm.controls["amount"].setValue(res.data[0].rentAmount)
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  closeModal() {
    this.modalRef.close('close');
    this.paymentForm.controls['refNo'].setValue("");
    this.paymentForm.controls['proofFile'].setValue("");
    this.getRentForFlat();
    this.loading = false;
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];

    if (!file) {
      this.paymentForm.controls['proofFile'].setValue(null);
      return;
    }

    this.proofFile = file;

    // mark control as valid
    this.paymentForm.controls['proofFile'].setValue(file.name);
    this.paymentForm.controls['proofFile'].markAsTouched();
  }

  addRent() {
    if (this.paymentForm.invalid || !this.proofFile) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const payload = {
      month: this.paymentForm.value.selected_month!,
      year: this.paymentForm.value.selected_year!,
      amount: this.paymentForm.value.amount!,
      refno: this.paymentForm.value.refNo!,
      proofFile: this.proofFile // File object
    };

    this.post.addRent(payload).subscribe({
      next: () => this.closeModal(),
      error: (err) => {
        this.alertService.show(err.error?.message || 'Upload failed');
      }
    });
  }


  viewRent(rent_id: any, viewModal: any) {
    this.rent_id = '';
    this.loading = true;
    this.proofUrl = '';
    this.post.getDocRentForFlat(rent_id).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.rent_id = rent_id;

        if (!res.proofFile) {
          this.alertService.show('No proof file found');
          return;
        }

        this.proofUrl = res.proofFile;

        // detect file type
        if (!this.proofUrl) {
          return;
        }

        this.proofType = this.proofUrl.endsWith('.pdf') ? 'pdf' : 'image';

        this.openViewModal(viewModal);
      },
      error: (err) => {
        this.loading = false;
        this.alertService.show(err.error?.message || 'Failed to load proof');
      }
    });
  }

  openViewModal(viewModal: any) {
    this.modalRef = this.modalService.open(viewModal);
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      }, (_reason: any) => {
        this.closeResult = `Dismissed`;
      }
    )
  }

  // ✅ SAFE & SIMPLE
  selectMonthYear(event: any) {
    const value = event.target.value;
    if (!value) return;

    const selectedItem = this.month.find(
      item => item.monthYr === value
    );

    if (!selectedItem) return;

    this.paymentForm.patchValue({
      selected_month: selectedItem.month,
      selected_year: String(selectedItem.year)
    });
    this.paymentForm.controls['selected_month'].setValue(selectedItem.month);
    this.paymentForm.controls['selected_year'].setValue(String(selectedItem.year));
  }

  // ✅ AUTO SELECT CURRENT MONTH
  setCurrentMonthYear() {
    const now = new Date();
    const currentMonthName = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ][now.getMonth()];
    const currentYear = now.getFullYear();

    const currentItem = this.month.find(
      item => item.month === currentMonthName && item.year === currentYear
    );

    if (!currentItem) return;
    this.paymentForm.patchValue({
      monthYear: currentItem.monthYr,
      selected_month: currentItem.month,
      selected_year: String(currentItem.year)
    });

    this.paymentForm.controls['selected_month'].setValue(currentItem.month);
    this.paymentForm.controls['selected_year'].setValue(String(currentItem.year));
  }

  /**
* 🔹 GET BY FLAT ADMIN_ID (VIEW CARD MODE)
*/
  getFlatsByFlatAdminId() {
    this.loading = true;

    this.post.getFlatsByFlatAdminId().subscribe({
      next: (res) => {
        this.flatNumber = res.data[0].flatNumber;
        this.floor = res.data[0].floor;
        this.rentAmount = Number(res.data[0].rentAmount);
        this.paymentForm.controls["amount"].setValue(this.rentAmount)
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }



  /**
  * 🔹 APARTMENT_ADMIN LOGIN 
  */
  getApartment() {
    this.isMulti = false;
    this.post.getApartment().subscribe(res => {
      this.apartments = res.data;
      this.apartment_Id = res.data[0]._id;

      if (res.data.length > 1) {
        this.isMulti = true;
        this.filterForm.controls['select_apartmentId'].setValue(res.data[0]._id)
      } else {
        this.isMulti = false;
        this.apartmentName = res.data[0].name;
      }
      this.getRent(this.apartment_Id);
    });

  }


  filterInTable(event: Event) {
    this.apartment_Id = '';
    const apartmentId = (event.target as HTMLSelectElement).value;
    this.apartment_Id = apartmentId
    this.getRent(this.apartment_Id);
  }

  setRadioFilter(event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.status = status;
    this.getRent(this.apartment_Id)
  }

  //status: 'uploaded' | 'paid' | 'rejected' = 'uploaded'
  getRent(apartment_Id: any,) {
    this.loading = true;

    this.post.getRentByApartment(apartment_Id, this.status).subscribe({
      next: (res) => {
        if (!res?.data?.length) {
          this.alertService.show('No data found!');
          this.rents = [];
          this.loading = false;
          return;
        }

        this.rents = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.show('Error to get data!');
      },
    });
  }



  closeViewModal() {
    if (this.isA_Admin) {
      this.rent_id = '';
      this.proofUrl = '';
      this.proofType = null;
      this.modalRef.close('close');
      this.getRent(this.apartment_Id);

    } else {
      this.rent_id = '';
      this.proofUrl = '';
      this.proofType = null;
      this.modalRef.close('close');

    }
  }

  //VERIFY/REJECT RENT    "paid", "rejected"
  verifyRent() {
    const payload = {
      status: "paid"
    }
    this.post.verifyRent(this.rent_id, payload).subscribe({
      next: (res) => {
        this.alertService.show("Rent Verified..!");
        this.closeViewModal();
      },
      error: () => {
        this.loading = false;
        this.alertService.show("Error to Action..!");
        this.closeViewModal();
      },
    });
  }

  rejectRent() {
    const payload = {
      status: "rejected"
    }
    this.post.verifyRent(this.rent_id, payload).subscribe({
      next: (res) => {
        this.alertService.show("Rent Rejected..!");
        this.closeViewModal();
      },
      error: () => {
        this.loading = false;
        this.alertService.show("Error to Action..!");
        this.closeViewModal();
      },
    });
  }

}
