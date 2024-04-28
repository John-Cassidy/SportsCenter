import { Address, UserAddress } from '../shared/models/Address';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subscription,
  catchError,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  login(model: Login): Observable<User> {
    return this.http.post(this.apiUrl + '/login', model).pipe(
      map((response) => response as User),
      tap((user: User) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.userSource.next(user);
          this.loadUserAddress();
        }
        return user;
      })
    );
  }

  // register(model: Register): Observable<{ message: string }> {
  //   return this.http.post<{ message: string }>(
  //     this.apiUrl + '/register',
  //     model
  //   );
  // }

  register(model: Register): Observable<{ message: string }> {
    return this.checkEmailExists(model.email).pipe(
      switchMap((response: { emailExists: boolean }) => {
        if (!response.emailExists) {
          return this.http.post<{ message: string }>(
            this.apiUrl + '/register',
            model
          );
        } else {
          return throwError(new Error('Email is already in use'));
        }
      }),
      catchError((error) => {
        // Handle any errors from the HTTP request
        return throwError(error);
      })
    );
  }

  logout() {
    return this.http.post(this.apiUrl + '/logout', {}).pipe(
      map(() => null),
      tap(() => {
        localStorage.removeItem('token');
        this.userSource.next(null);
        localStorage.removeItem('userAddress');
        this.router.navigateByUrl('/');
        return;
      }),
      catchError((error) => {
        console.error('Error in logout:', error);
        throw error;
      })
    );
  }

  checkEmailExists(email: string): Observable<{ emailExists: boolean }> {
    return this.http.get<{ emailExists: boolean }>(
      this.apiUrl + '/check-email-exists?email=' + email
    );
  }

  // loadUser(token: string): Observable<User> {
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http
  //     .get<User>(this.apiUrl + '/load-user', { headers: headers })
  //     .pipe(
  //       map((response) => response as User),
  //       tap((user: User) => {
  //         if (user) {
  //           localStorage.setItem('token', user.token);
  //           this.userSource.next(user);
  //         }
  //         return user;
  //       }),
  //       catchError((error: any) => {
  //         console.error('Error in loadUser:', error);
  //         throw error;
  //       })
  //     );
  // }

  // loadUser(token: string): Subscription {
  //   // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   const headers = { Authorization: `Bearer ${token}` };
  //   return this.http
  //     .get<User>(this.apiUrl + '/load-user', { headers: headers })
  //     .pipe(map((response) => response as User))
  //     .subscribe({
  //       next: (user: User) => {
  //         if (user) {
  //           localStorage.setItem('token', user.token);
  //           this.userSource.next(user);
  //         }
  //       },
  //       error: (error: any) => {
  //         console.error('Error in loadUser:', error);
  //       },
  //     });
  // }

  loadUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http
        .get<User>(this.apiUrl + '/load-user')
        .pipe(map((response) => response as User))
        .subscribe({
          next: (user: User) => {
            if (user) {
              localStorage.setItem('token', user.token);
              this.userSource.next(user);
              this.loadUserAddress();
            }
          },
          error: (error: any) => {
            console.error('Error in loadUser:', error);
          },
        });
    } else {
      this.userSource.next(null);
      localStorage.removeItem('userAddress');
    }
  }

  loadUserAddress() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http
        .get<Address>(this.apiUrl + '/user-address')
        .pipe(
          map((address: Address) => {
            // Get the current user from userSource
            const user = this.userSource.value;
            // If user is null, throw an error
            if (!user) {
              throw new Error('User is null');
            }
            // Create a new UserAddress object
            const userAddress: UserAddress = {
              email: user.email,
              address: address,
            };
            return userAddress;
          }),
          tap((userAddress: UserAddress) => {
            // Store the userAddress in localStorage
            localStorage.setItem('userAddress', JSON.stringify(userAddress));
          }),
          catchError((error: any) => {
            console.error('Error in getUserAddress:', error);
            throw error;
          })
        )
        .subscribe();
    }
  }
}
