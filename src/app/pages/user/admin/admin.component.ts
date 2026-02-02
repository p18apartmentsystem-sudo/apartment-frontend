import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  role!: string | null;
  modalRef: any;
  closeResult: string;
  isAdd: boolean = false;

  adminForm = new FormGroup({
    name: new FormControl("", Validators.required),
    mobile: new FormControl("", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    password: new FormControl("", Validators.required),
  });

  id: any = 0;
  admins: any;
  loading = false;
  adminId: any;

  constructor(private authState: AuthStateService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private router: Router,
    private userService: UserService) { }


  ngOnInit(): void {

    this.role = this.authState.getRole();
    if (this.role === 'super_admin') {
      this.getAdmin();
    } else {
      this.router.navigate(['/auth/login'])
    }
  }

  get adminMobile() {
    return this.adminForm.get('mobile')
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
    this.adminId = data._id
    this.adminForm.controls["name"].setValue(data.name)
    this.adminForm.controls["mobile"].setValue(data.mobile)

    this.modalRef = this.modalService.open(addModal);
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      }, (_reason: any) => {
        this.closeResult = `Dismissed`;
      }
    )
  }

  getAdmin() {
    this.userService.getAllAdmins().subscribe(res => {
      this.admins = res.data;
    });

  }

  /**
 * 🔹 GET ADMIN BY ID (EDIT MODE)
 */
  getAdminById(adminId: string) {
    this.loading = true;

    this.userService.getAdminById(adminId).subscribe({
      next: (res) => {

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }


  /**
   * 🔹 ADD ADMIN
   */
  addAdmin() {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = {
      name: this.adminForm.value.name!,
      mobile: this.adminForm.value.mobile!,
      password: this.adminForm.value.password!,
    };

    this.userService.addAdmin(payload).subscribe({
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
   * 🔹 UPDATE ADMIN
   */
  updateAdmin() {
    if (!this.adminId) return;

    this.loading = true;

    const payload = {
      name: this.adminForm.value.name ?? undefined,
      mobile: this.adminForm.value.mobile ?? undefined,
    };

    this.userService.updateAdminById(this.adminId, payload).subscribe({
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
    this.getAdmin();
    this.isAdd = false;
    this.adminId = '';
    this.adminForm.reset()
    this.adminForm.controls['name'].setValue("")
    this.adminForm.controls['mobile'].setValue("")
    this.adminForm.controls['password'].setValue("")
    this.modalRef.close('close');
  }

  deleteUser(adminId: any) {
    this.userService.deleteAdminById(adminId).subscribe(() => {
      this.getAdmin();
    });

  }

}
