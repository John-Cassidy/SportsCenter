import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService } from '../account.service';
import { CoreComponent } from '../../core';
import { Register } from '../../shared/models/Register';
import { Router } from '@angular/router';
import { SharedComponent } from '../../shared';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  model: Register = {
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
        displayName: ['', Validators.required],
      },
      { validator: this.checkPasswords }
    );
  }

  ngOnInit(): void {}

  checkPasswords(group: FormGroup) {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.accountService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log(response.message);
          // Redirect to the login page or perform other actions
          this.router.navigate(['/account/login']);
        },
        error: (error) => {
          // Check if the error message is 'Email is already in use'
          if (error.message === 'Email is already in use') {
            // Show a Toastr error message
            this.toastr.error('Email is already in use');
          } else {
            // Handle other errors here
            this.toastr.error('An error occurred');
          }
        },
      });
    }
  }
}
