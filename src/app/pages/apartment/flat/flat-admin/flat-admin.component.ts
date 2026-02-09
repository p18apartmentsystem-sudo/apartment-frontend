import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApartmentService } from '../../apartment.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-flat-admin',
  templateUrl: './flat-admin.component.html',
  styleUrl: './flat-admin.component.scss'
})
export class FlatAdminComponent {
  role!: string | null;
  modalRef: any;
  closeResult: string;

  adminForm = new FormGroup({
    name: new FormControl("", Validators.required),
    mobile: new FormControl("", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    password: new FormControl("123456", Validators.required),
    email: new FormControl(""),
    apartmentId: new FormControl(""),
    flatId: new FormControl(""),
  });

  flatMember: any;
  loading = false;
  isF_Admin: boolean = false;
  flat_Id: any;
  apartment_Id: any;
  apartment_name: any;
  flat: any;
  flatNumber: any;
  floor: any;
  rentAmount: any;

  constructor(private authState: AuthStateService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private router: Router,
    private post: ApartmentService,
    private alertService: AlertService) { }


  ngOnInit(): void {

    this.role = this.authState.getRole();
    if (this.role === 'flat_admin') {
      this.isF_Admin = true;
      //get flat details API
      this.getFlatsByFlatAdminId();
    } else {
      this.isF_Admin = false;
      // this.router.navigate(['/auth/login'])
      this.authState.logout();
    }
  }

  openAddModal(addModal: any) {
    this.adminForm.controls["name"].setValue("")
    this.adminForm.controls['mobile'].setValue("")
    this.adminForm.controls['password'].setValue("123456")
    this.adminForm.controls['email'].setValue("")
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
 * 🔹 GET BY FLAT ADMIN_ID (EDIT MODE)
 */
  getFlatsByFlatAdminId() {
    this.loading = true;

    this.post.getFlatsByFlatAdminId().subscribe({
      next: (res) => {
        if (res.data[0].apartmentId) {
          this.flatNumber = res.data[0].flatNumber;
          this.floor = res.data[0].floor;
          this.rentAmount = Number(res.data[0].rentAmount);
          this.flat_Id = res.data[0]._id;
          this.apartment_Id = res.data[0].apartmentId._id;
          this.apartment_name = res.data[0].apartmentId.name;
          this.flat = res.data[0];
          this.flatMember = res.data[0].residents;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }


  closeModal() {
    this.modalRef.close('close');
    this.adminForm.reset();

    this.adminForm.controls['name'].setValue("")
    this.adminForm.controls['mobile'].setValue("")
    this.adminForm.controls['email'].setValue("")
    this.adminForm.controls['password'].setValue("123456")
    this.getFlatsByFlatAdminId();
    this.loading = false;
  }

  deleteMember(userId: any) {
    this.post.deleteFlatMemberById(userId).subscribe(() => {
      this.getFlatsByFlatAdminId();
    });

  }

  get adminMobile() {
    return this.adminForm.get('mobile')
  }

  addMember() {

    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    const payload = {
      apartmentId: this.apartment_Id!,
      flatId: this.flat_Id!,
      name: this.adminForm.value.name!,
      mobile: this.adminForm.value.mobile!,
      password: this.adminForm.value.password!,
      email: this.adminForm.value.email!
    };

    this.post.addMember(payload).subscribe({
      next: (res) => {
        this.alertService.show(res.message);
        this.closeModal();
      },
      error: () => {
        this.loading = false;
      },
    });
  }


}
