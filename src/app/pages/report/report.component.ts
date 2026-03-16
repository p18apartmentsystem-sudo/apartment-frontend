import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportService, PendingPaymentsResponse } from './report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit {

  paymentForm!: FormGroup;
  month: any[] = [];
  pendingData!: PendingPaymentsResponse;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      monthYear: [''],
      selected_month: [''],
      selected_year: ['']
    });

    this.month = this.generateMonthYearArray();
    this.setCurrentMonthYear();
    this.loadReport();
  }

  // ✅ YOUR SAME LOGIC
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
  }

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

    this.loadReport();
  }

  loadReport() {
    const month = this.paymentForm.value.selected_month;
    const year = this.paymentForm.value.selected_year;

    if (!month || !year) return;

    this.loading = true;

    this.reportService.getPendingPayments(month, Number(year))
      .subscribe({
        next: (res) => {
          this.pendingData = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

}