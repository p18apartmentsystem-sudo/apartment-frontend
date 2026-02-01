import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

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

  constructor(private userService: UserService) { }

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
        alert(res.message);
        this.loading = false;
      },
      error: err => {
        alert(err.error.message);
        this.loading = false;
      }
    });
  }

  sendOtp() {
    this.userService.sendEmailOtp(this.profile.email).subscribe(res => {
      alert("OTP sent to email");
      this.showOtpBox = true;
    });
  }

  verifyOtp() {
    this.userService.verifyEmailOtp(this.profile.email, this.otp).subscribe(res => {
      alert("Email verified successfully");
      this.showOtpBox = false;
      this.loadProfile(); // refresh status
    });
  }

  toUppercase(event: Event) {
    const input = event.target as HTMLInputElement;
    const cursorPos = input.selectionStart || 0;

    input.value = input.value.toUpperCase();

    // restore cursor position
    input.setSelectionRange(cursorPos, cursorPos);
  }

  enableEditMode() {
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
  }
}
