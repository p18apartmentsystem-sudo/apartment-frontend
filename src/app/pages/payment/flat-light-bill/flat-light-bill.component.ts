import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { PaymentService } from '../payment.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-flat-light-bill',
  templateUrl: './flat-light-bill.component.html',
  styleUrl: './flat-light-bill.component.scss'
})
export class FlatLightBillComponent {
  role!: string | null;
  modalRef: any;
  closeResult: string;

  paymentForm = new FormGroup({
    apartmentId: new FormControl(""),
    flatId: new FormControl(""),
    flatNumber: new FormControl(""),
    selected_month: new FormControl(""),
    selected_year: new FormControl(""),
    amount: new FormControl(""),
    monthYear: new FormControl(""),
    proofFile: new FormControl("")
  });
  filterForm = new FormGroup({
    apartmentName: new FormControl(""),
    select_apartmentId: new FormControl(""),
  });

  loading = false;
  isA_Admin: boolean = false;
  proofFile!: File;
  apartment_Id: any;
  apartment_name: any;
  flat: any;
  lightBills: any;
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
  rentAmount: any;
  rent_id: any;
  isViewTable: boolean = false;
  floors: any[] = [];
  showFloorRadios = false;
  selectedFloor: any = null;
  flats: any[] = [];
  isFlat: boolean = false;
  isFloor: boolean = false;

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
      this.month = this.post.generateMonthYearArray();
      this.getApartment();
    } else {
      this.isA_Admin = false;
      // this.router.navigate(['/auth/login'])
      this.authState.logout();
    }
  }


  closeModal() {
    this.getFloor(this.apartment_Id);

    this.isFlat = false;
    this.isFloor = false;

    // 🔥 CLEAR RADIO SELECTION
    this.selectedFloor = null;

    this.paymentForm.reset({
      amount: '',
      proofFile: '',
      flatId: '',
      selected_month: '',
      selected_year: ''
    });

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

  addLightBill() {
    if (this.paymentForm.invalid || !this.proofFile) {
      this.paymentForm.markAllAsTouched();
      console.log("id", this.paymentForm.value.flatId, "a_id", this.paymentForm.value.apartmentId)
      this.alertService.show('* Fields mandatory..!');
      return;
    }

    const payload = {
      apartmentId: this.paymentForm.value.apartmentId,
      flatId: this.paymentForm.value.flatId,
      month: this.paymentForm.value.selected_month!,
      year: this.paymentForm.value.selected_year!,
      amount: this.paymentForm.value.amount!,
      proofFile: this.proofFile // File object
    };

    this.post.addLightBillByA_Admin(payload).subscribe({
      next: (res) => {
        this.alertService.show('Light Bill Added..!');
        this.isFlat = false;
        this.paymentForm.controls["flatId"].setValue('');
        this.paymentForm.controls["apartmentId"].setValue('');
        this.paymentForm.controls["flatNumber"].setValue('');
        this.paymentForm.controls["amount"].setValue('');
        this.getFlat(this.apartment_Id, this.selectedFloor);
        this.getLightBill(this.apartment_Id);
      },
      error: (err) => {
        this.alertService.show(err.error?.message || 'Upload failed');
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

  viewLightBill(rent_id: any, viewModal: any) {
    this.rent_id = '';
    this.loading = true;
    this.proofUrl = '';
    this.post.getDocLightBillForFlat(rent_id).subscribe({
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

  /**
* 🔹 GET BY FLAT By FLOOR
*/
  getFlat(apartment_Id: any, selectedFloor: any) {
    this.loading = true;

    this.post.getFlatByApartmentFloor(apartment_Id, selectedFloor).subscribe({
      next: (res) => {
        this.flats = res.data;
        this.isFloor = true;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.isFloor = false;
      },
    });
  }

  getFlatDetails(id: any) {
    if (!id) {
      this.isFlat = false;
      this.paymentForm.controls["flatId"].setValue('');
      this.paymentForm.controls["apartmentId"].setValue('');
      this.paymentForm.controls["flatNumber"].setValue('');
      this.paymentForm.controls["amount"].setValue('');
      return;
    }
    this.loading = true;
    this.isFlat = false;

    this.paymentForm.reset();

    this.post.getFlatById(id).subscribe({
      next: (res) => {
        const flat = res.data;

        this.isFlat = true;

        this.paymentForm.patchValue({
          flatId: String(flat._id), // ✅ SAFE
          apartmentId: String(
            flat.apartmentId?._id || flat.apartmentId
          ), // 🔥 KEY FIX
          flatNumber: flat.flatNumber,
        });
        this.loading = false;

        this.setCurrentMonthYear();
      },
      error: () => {
        this.loading = false;
        this.isFlat = false;
      },
    });
  }




  viewTable() {
    this.isViewTable = true;
  }

  hideTable() {
    this.isViewTable = false;
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
      this.getLightBill(this.apartment_Id);
      this.getFloor(this.apartment_Id);
    });
  }

  filterInTable(event: Event) {
    this.apartment_Id = '';
    const apartmentId = (event.target as HTMLSelectElement).value;
    this.apartment_Id = apartmentId
    this.getLightBill(this.apartment_Id);
    this.getFloor(this.apartment_Id);
  }

  getLightBill(apartment_Id: any,) {
    this.loading = true;

    this.post.getLightBillByApartmentAdmin(apartment_Id).subscribe({
      next: (res) => {
        if (!res?.data?.length) {
          // this.alertService.show('No data found!');
          this.lightBills = [];
          this.loading = false;
          return;
        }

        this.lightBills = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.show('Error to get data!');
      },
    });
  }



  getFloor(apartment_Id: any) {
    this.loading = true;
    this.isFloor = false;
    this.isFlat = false;
    this.paymentForm.controls["flatId"].setValue('');
    this.paymentForm.controls["apartmentId"].setValue('');
    this.paymentForm.controls["flatNumber"].setValue('');
    this.paymentForm.controls["amount"].setValue('');

    this.post.getFloorByApartment(apartment_Id).subscribe({
      next: (res) => {
        this.loading = false;

        if (!res?.data?.length) {
          this.alertService.show('No data found!');
          this.floors = [];
          this.showFloorRadios = false;
          return;
        }

        this.floors = res.data;
        this.showFloorRadios = this.floors.length <= 12;
      },
      error: () => {
        this.loading = false;
        this.alertService.show('Error to get data!');
      },
    });
  }

  onFloorChange(value: any) {
    this.selectedFloor = value;
    this.isFlat = false;
    this.isFloor = false;
    this.paymentForm.controls["flatId"].setValue('');
    this.paymentForm.controls["apartmentId"].setValue('');
    this.paymentForm.controls["flatNumber"].setValue('');
    this.paymentForm.controls["amount"].setValue('');
    this.getFlat(this.apartment_Id, this.selectedFloor)
  }


  closeViewModal() {
    if (this.isA_Admin) {
      this.rent_id = '';
      this.proofUrl = '';
      this.proofType = null;
      this.modalRef.close('close');

    } else {
      this.rent_id = '';
      this.proofUrl = '';
      this.proofType = null;
      this.modalRef.close('close');

    }
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
    console.log(this.paymentForm.value.monthYear)
    this.paymentForm.controls['selected_month'].setValue(currentItem.month);
    this.paymentForm.controls['selected_year'].setValue(String(currentItem.year));
    this.cd.detectChanges();
  }

}
