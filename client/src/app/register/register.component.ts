import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;
  maxDateString: string;
  serverValidationErrors: string[] = [];

  constructor(private accountService: AccountService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.setMaxDate();
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [this.maxDateString, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  setMaxDate() {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    this.maxDateString = `${maxDate.getFullYear()}-${this.ensureTwoDigitNumberToString(maxDate.getMonth() + 1)}-`
      + `${this.ensureTwoDigitNumberToString(maxDate.getDate())}`
  }

  register() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: _ => {
        this.router.navigate(['/members']);
        this.cancel();
      },
      error: errors => {
        this.serverValidationErrors = errors;
    }});
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true }
    };
  }

  ensureTwoDigitNumberToString(num: number): string {
    return num < 10 ? '0' + num.toString() : num.toString();
  }
}