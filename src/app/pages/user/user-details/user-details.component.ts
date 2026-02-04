import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {

  profile: any = {};
  otp = '';
  showOtpBox = false;
  loading = false;
  isEditMode = false;

  constructor(private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getMyProfile().subscribe(res => {
      this.profile = res.data;
    });
  }

  updateProfile() {
    this.loading = true;
    this.userService.updateMyProfile(this.profile).subscribe({
      next: res => {
        this.alertService.show(res.message);
        this.loading = false;
      },
      error: err => {
        this.alertService.show(err.error.message);
        this.loading = false;
      }
    });
  }

  sendOtp() {
    this.userService.sendEmailOtp(this.profile.email).subscribe(res => {
      this.alertService.show("OTP sent to email");
      this.showOtpBox = true;
    });
  }

  verifyOtp() {
    this.userService.verifyEmailOtp(this.profile.email, this.otp).subscribe(res => {
      this.alertService.show("Email verified successfully");
      this.showOtpBox = false;
      this.loadProfile(); // refresh status
    });
  }

  enableEditMode() {
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
  }
}
