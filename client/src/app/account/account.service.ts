import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../shared/models/Login';
import { Register } from '../shared/models/Register';
import { Router } from '@angular/router';
import { User } from '../shared/models/User';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'http://localhost:5096/account';
  private userSource = new BehaviorSubject<User | null>(null);
  userSource$ = this.userSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(model: Login): Observable<User> {
    return this.http.post(this.apiUrl + '/login', model).pipe(
      map((response) => response as User),
      tap((user: User) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.userSource.next(user);
        }
        return user;
      })
    );
  }

  register(model: Register): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      this.apiUrl + '/register',
      model
    );
  }

  logout() {
    return this.http.post(this.apiUrl + '/logout', {}).pipe(
      map(() => null),
      tap(() => {
        localStorage.removeItem('token');
        this.userSource.next(null);
        this.router.navigateByUrl('/');
        return;
      }),
      catchError((error) => {
        console.error('Error in logout:', error);
        throw error;
      })
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(
      this.apiUrl + '/check-email-exists?email=' + email
    );
  }
}
