
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { ApartmentService } from '../apartment.service';


@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrl: './complaint.component.scss'
})
export class ComplaintComponent {

  role!: string | null;
  modalRef: any;
  isAdd: boolean = true;
  loading = false;

  isA_Admin = false;
  isF_Admin = false;

  complaintData: any[] = [];
  complaintId: string = '';

  addForm = new FormGroup({
    category: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(
    private authState: AuthStateService,
    private modalService: NgbModal,
    private post: ApartmentService,
    private alertService: AlertService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.role = this.authState.getRole();

    if (this.role === 'apartment_admin') {
      this.isA_Admin = true;
      this.getAllApartmentComplaints();
    }
    else if (this.role === 'flat_admin' || this.role === 'resident') {
      this.isF_Admin = true;
      this.getFlatComplaints();
    } else {
      this.authState.logout();
    }
  }

  /* ===========================================
     🔹 MODAL HANDLING
  ============================================ */

  openAddModal(addModal: any) {
    this.isAdd = true;
    this.modalRef = this.modalService.open(addModal);
  }

  openUpdateModal(addModal: any, data: any) {
    if (!this.isA_Admin) return; // only admin can update

    this.isAdd = false;
    this.complaintId = data._id;

    this.addForm.patchValue({
      category: data.category,
      description: data.description
    });

    this.modalRef = this.modalService.open(addModal);
  }

  closeModal() {
    this.addForm.reset();
    this.complaintId = '';
    this.modalRef.close();
    this.refreshData();
  }

  /* ===========================================
     🔹 GET METHODS
  ============================================ */

  getFlatComplaints() {
    this.loading = true;

    this.post.getFlatComplaints().subscribe({
      next: (res) => {
        this.complaintData = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getMyComplaints() {
    this.loading = true;

    this.post.getMyComplaints().subscribe({
      next: (res) => {
        this.complaintData = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getAllApartmentComplaints() {
    this.loading = true;

    this.post.getAllApartmentComplaints().subscribe({
      next: (res) => {
        this.complaintData = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  refreshData() {
    if (this.role === 'apartment_admin') {
      this.getAllApartmentComplaints();
    } else {
      this.getFlatComplaints();
    }
  }

  /* ===========================================
     🔹 ADD COMPLAINT
  ============================================ */

  add() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = {
      category: this.addForm.value.category!,
      description: this.addForm.value.description!,
    };

    this.post.raiseComplaint(payload).subscribe({
      next: (res) => {
        this.alertService.show('Complaint Raised..!');
        this.closeModal();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  /* ===========================================
     🔹 ADD COMPLAINT
  ============================================ */

  addBroadcast() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = {
      title: this.addForm.value.category!,
      body: this.addForm.value.description!,
    };

    this.post.broadcastToApartment(payload).subscribe({
      next: (res) => {
        this.alertService.show('Complaint Raised..!');
        this.closeModal();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  /* ===========================================
     🔹 UPDATE STATUS (ADMIN ONLY)
  ============================================ */

  updateStatus(status: string) {
    if (!this.complaintId) return;

    this.loading = true;

    this.post.updateComplaintStatus(this.complaintId, { status })
      .subscribe({
        next: () => {
          this.alertService.show('Status Updated');
          this.closeModal();
        },
        error: () => this.loading = false
      });
  }

}
