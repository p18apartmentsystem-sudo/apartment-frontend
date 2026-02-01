import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../payment.service';

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

  loading = false;
  isF_Admin: boolean = false;
  proofFile!: File;
  apartment_Id: any;
  apartment_name: any;
  flat: any;
  rents: any;

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

  constructor(private authState: AuthStateService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private router: Router,
    private post: PaymentService) { }


  ngOnInit(): void {

    this.role = this.authState.getRole();
    if (this.role === 'flat_admin') {
      this.isF_Admin = true;
      //get flat details API
      this.getRentForFlat();
      this.month = this.post.generateMonthYearArray();
      this.setCurrentMonthYear();
      this.getFlatsByFlatAdminId();
    } else {
      this.isF_Admin = false;
      this.router.navigate(['/auth/login'])
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
        alert(err.error?.message || 'Upload failed');
      }
    });
  }


  toUppercase(event: Event) {
    const input = event.target as HTMLInputElement;
    const cursorPos = input.selectionStart || 0;

    input.value = input.value.toUpperCase();

    // restore cursor position
    input.setSelectionRange(cursorPos, cursorPos);
  }

  viewRent(rent_id: any, viewModal: any) {
    this.loading = true;
    this.proofUrl = '';

    this.post.getDocRentForFlat(rent_id).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (!res.proofFile) {
          alert('No proof file found');
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
        alert(err.error?.message || 'Failed to load proof');
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
* 🔹 GET BY FLAT ADMIN_ID (EDIT MODE)
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
}
