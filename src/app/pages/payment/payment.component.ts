import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { PaymentService } from './payment.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  role!: string | null;
  apartment!: any;
  apartmentId!: string | null;
  loading = false;
  flats: any[];
  selectedFlats: Set<string> = new Set();
  isSelect: boolean = false;
  paymentForm!: FormGroup;
  month: any[] = [];
  lightAmount: any = 0;
  totalFlats = 0;
  rentPaid = 0;
  rentPending = 0;
  lightPaid = 0;
  lightPending = 0;



  constructor(private authState: AuthStateService,
    private fb: FormBuilder,
    private router: Router,
    private post: PaymentService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      monthYear: [''],
      selected_month: [''],
      selected_year: ['']
    });

    this.month = this.generateMonthYearArray();
    this.setCurrentMonthYear();
    this.apartment = this.authState.getApartment();
    this.apartmentId = this.apartment?.id;
    this.loadFlats();

  }

  generateMonthYearArray() {
    const result: any[] = [];

    const startMonth = 5;
    const startYear = 2025;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    let year = startYear;
    let monthIndex = startMonth;

    while (
      year < currentYear ||
      (year === currentYear && monthIndex <= currentMonth)
    ) {
      result.push({
        month: months[monthIndex],
        year: year,
        monthYr: `${months[monthIndex]} ${year}`
      });

      monthIndex++;
      if (monthIndex > 11) {
        monthIndex = 0;
        year++;
      }
    }

    return result.reverse();
  }
  // ✅ SAFE & SIMPLE
  selectMonthYear(event: any) {
    this.selectedFlats = new Set();
    this.isSelect = false;
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

    this.loadFlats();
  }

  // ✅ AUTO SELECT CURRENT MONTH
  setCurrentMonthYear() {
    const now = new Date();
    const currentMonthName = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ][now.getMonth() - 1];
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
  }


  /**
 * 🔹 GET FLATs BY APARTMENT ID 
 */
  loadFlats() {

    this.post
      .getFlatPayments(this.apartmentId, this.paymentForm.value.selected_month, this.paymentForm.value.selected_year)
      .subscribe((res: any) => {

        this.flats = res.data;

        this.totalFlats = this.flats.length;

        this.rentPaid =
          this.flats.filter(f => f.rentStatus === 'paid').length;

        this.rentPending =
          this.flats.filter(f => f.rentStatus !== 'paid').length;

        this.lightPaid =
          this.flats.filter(f => f.lightBillStatus === 'paid').length;

        this.lightPending =
          this.flats.filter(f => f.lightBillStatus !== 'paid').length;
      });

  }

  toggleFlat(id: string, event: any) {

    if (event.target.checked) {
      this.selectedFlats.add(id);
      this.isSelect = true;
    } else {
      this.selectedFlats.delete(id);
    }

  }

  isSelected(id: string) {
    return this.selectedFlats.has(id);
  }

  toggleAll(event: any) {
    if (event.target.checked) {

      this.flats.forEach(flat => {

        if (!(flat.rentStatus === 'paid' && flat.lightBillStatus === 'paid')) {
          this.selectedFlats.add(flat.flatId);
        }

      });
      this.isSelect = true;
    } else {

      this.selectedFlats.clear();
      this.isSelect = false;
    }

  }

  isAllSelected() {

    if (!this.flats || this.flats.length === 0) {
      return false;
    }

    const selectableFlats = this.flats.filter(flat =>
      !(flat.rentStatus === 'paid' && flat.lightBillStatus === 'paid')
    );

    return this.selectedFlats.size === selectableFlats.length;

  }

  markRentPaid() {

    if (this.selectedFlats.size === 0) {
      alert("Select flats first");
      return;
    }

    const payload = {
      apartmentId: this.apartmentId,
      flatIds: Array.from(this.selectedFlats),
      month: this.paymentForm.value.selected_month,
      year: this.paymentForm.value.selected_year
    };

    this.post.bulkRentPaid(payload)
      .subscribe((res: any) => {

        this.loadFlats();

      });

  }

  markLightPaid() {

    if (this.selectedFlats.size === 0) {
      alert("Select flats first");
      return;
    }

    const payload = {
      apartmentId: this.apartmentId,
      flatIds: Array.from(this.selectedFlats),
      month: this.paymentForm.value.selected_month,
      year: this.paymentForm.value.selected_year,
      amount: this.lightAmount
    };

    this.post.bulkLightPaid(payload)
      .subscribe((res: any) => {

        this.loadFlats();

      });

  }

  markSinglePaid(flat: any, type: string) {

    const payload = {

      apartmentId: this.apartmentId,
      flatId: flat.flatId,
      month: this.paymentForm.value.selected_month,
      year: this.paymentForm.value.selected_year,
      type: type

    };

    this.post.singlePaid(payload)
      .subscribe(() => {

        this.loadFlats();

      });

  }

}