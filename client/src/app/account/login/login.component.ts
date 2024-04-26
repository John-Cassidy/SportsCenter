import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService } from '../account.service';
import { CoreComponent } from '../../core';
import { Login } from '../../shared/models/Login';
import { SharedComponent } from '../../shared';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  model: Login = { email: '', password: '', rememberMe: false };

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe({
        next: (user) => {
          console.log('Login successful');
          // Navigate to home page etc.
        },
        error: (error) => {
          console.log('Login failed');
        },
      });
    }
  }
}
