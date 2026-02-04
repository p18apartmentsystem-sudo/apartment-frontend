import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!: FormGroup;
  step: 1 | 2 | 3 = 1; // flow controller

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: [''],
      newPassword: ['']
    });
  }

  submit() {
    if (this.step === 1) {
      this.sendOtp();
    } else if (this.step === 2) {
      this.verifyOtp();
    } else {
      this.resetPassword();
    }
  }

  // 1️⃣ SEND OTP
  sendOtp() {
    const email = this.forgotPasswordForm.value.email;

    this.authService.sendEmailOtp(email).subscribe(() => {
      this.step = 2;
      this.alertService.show("OTP sent to email- " + this.forgotPasswordForm.value.email);
    });
  }

  // 2️⃣ VERIFY OTP
  verifyOtp() {
    const payload = {
      email: this.forgotPasswordForm.value.email,
      otp: this.forgotPasswordForm.value.otp,
    };

    this.authService.verifyEmailOtp(payload).subscribe(() => {
      this.step = 3;
      this.alertService.show("Email verified successfully");
    });
  }

  // 3️⃣ RESET PASSWORD
  resetPassword() {
    const payload = {
      email: this.forgotPasswordForm.value.email,
      newPassword: this.forgotPasswordForm.value.newPassword,
    };

    this.authService.resetPassword(payload).subscribe(() => {
      this.alertService.show('Password reset successfully');
      this.step = 1;
      this.forgotPasswordForm.reset();
      this.router.navigate(['/auth/login'])
    });
  }

  gotoLogin() {
    this.step = 1;
    this.forgotPasswordForm.reset();
    this.router.navigate(['/auth/login'])
  }
}
