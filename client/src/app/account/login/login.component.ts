import { ActivatedRoute, Router } from '@angular/router';
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
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
    // Get returnUrl from route parameters or default to '/'
    this.route.queryParams.subscribe((params) => {
      this.accountService.redirectUrl = params['returnUrl'] || '/';
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe({
        next: (user) => {
          console.log('Login successful');
          // Redirect to the stored returnUrl or to the store page if no returnUrl is available
          const redirect = this.accountService.redirectUrl
            ? this.accountService.redirectUrl
            : '/store';
          this.router.navigateByUrl(redirect); // Use navigateByUrl to handle complex URLs
          this.accountService.redirectUrl = null; // Clear the stored URL
        },
        error: (error) => {
          console.log('Login failed');
        },
      });
    }
  }
}
