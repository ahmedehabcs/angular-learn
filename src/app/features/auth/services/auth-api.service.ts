import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginData, RegisterData, AuthResponse, CurrentUser } from '../models/auth.model';

interface LocalAccount extends CurrentUser {
  password: string;
}

interface DummyJsonUsersResponse {
  users: DummyJsonUser[];
}

interface DummyJsonUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly accountsKey = 'localAccounts';
  private readonly currentUserKey = 'currentUser';
  readonly isLoggedIn = signal(Boolean(localStorage.getItem('token')));

  login(data: LoginData): Observable<AuthResponse> {
    const localAccount = this.getAccounts().find(
      (account) => account.email.toLowerCase() === data.email.toLowerCase()
    );

    if (localAccount) {
      if (localAccount.password !== data.password) {
        return this.authError('Invalid email or password');
      }

      const response: AuthResponse = {
        message: 'Login successful',
        accessToken: `local-token-${localAccount.id}`,
        user: localAccount,
      };

      this.saveCurrentUser(localAccount);
      this.startSession(response.accessToken);
      return of(response);
    }

    const filterUrl =
      `${environment.apiUrl}/users/filter?key=email&value=${encodeURIComponent(data.email)}`;

    return this.http.get<DummyJsonUsersResponse>(filterUrl).pipe(
      switchMap((response) => {
        const user = response.users[0];

        if (!user) {
          return this.authError<DummyJsonUser>('Invalid email or password');
        }

        return this.http.post<DummyJsonUser>(
          `${environment.apiUrl}/auth/login`,
          {
            username: user.username,
            password: data.password,
          }
        );
      }),
      map((user) => {
        const currentUser: CurrentUser = {
          id: user.id.toString(),
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: 'customer',
          image: user.image,
        };

        return {
          message: 'Login successful',
          accessToken: user.accessToken ?? '',
          user: currentUser,
        };
      }),
      tap((response) => {
        this.startSession(response.accessToken);

        if (response.user) {
          this.saveCurrentUser({
            ...response.user,
            role: 'customer',
          });
        }
      })
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    const accounts = this.getAccounts();
    const emailExists = accounts.some(
      (account) => account.email.toLowerCase() === data.email.toLowerCase()
    );

    if (emailExists) {
      return this.authError('An account with this email already exists', 409);
    }

    const account: LocalAccount = {
      id: Date.now().toString(),
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: 'customer',
    };

    localStorage.setItem(this.accountsKey, JSON.stringify([...accounts, account]));
    this.saveCurrentUser(account);

    const response: AuthResponse = {
      message: 'Account created successfully',
      accessToken: `local-token-${account.id}`,
      user: account,
    };

    this.startSession(response.accessToken);
    return of(response);
  }

  me(): Observable<CurrentUser> {
    const user = this.getCurrentUser();

    return user
      ? of(user)
      : this.authError('Please login to view your profile');
  }

  updateProfile(data: FormData): Observable<CurrentUser> {
    const user = this.getCurrentUser();

    if (!user) {
      return this.authError('Please login to update your profile');
    }

    const updatedUser: CurrentUser = {
      ...user,
      fullName: data.get('fullName')?.toString() ?? user.fullName,
      email: data.get('email')?.toString() ?? user.email,
    };

    this.saveCurrentUser(updatedUser);
    this.updateLocalAccount(updatedUser);

    const image = data.get('image');

    if (!(image instanceof File)) {
      return of(updatedUser);
    }

    return new Observable<CurrentUser>((subscriber) => {
      const reader = new FileReader();

      reader.onload = () => {
        const userWithImage = {
          ...updatedUser,
          image: reader.result as string,
        };

        this.saveCurrentUser(userWithImage);
        this.updateLocalAccount(userWithImage);
        subscriber.next(userWithImage);
        subscriber.complete();
      };

      reader.onerror = () => {
        subscriber.error(new Error('Could not read the selected image'));
      };

      reader.readAsDataURL(image);
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem(this.currentUserKey);
    this.isLoggedIn.set(false);
  }

  private startSession(token: string): void {
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);
  }

  private getAccounts(): LocalAccount[] {
    const accounts = localStorage.getItem(this.accountsKey);
    return accounts ? JSON.parse(accounts) : [];
  }

  private getCurrentUser(): CurrentUser | null {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  private saveCurrentUser(user: CurrentUser): void {
    const { id, fullName, email, role, image } = user;
    localStorage.setItem(
      this.currentUserKey,
      JSON.stringify({ id, fullName, email, role, image })
    );
  }

  private updateLocalAccount(user: CurrentUser): void {
    const accounts = this.getAccounts();
    const accountIndex = accounts.findIndex((account) => account.id === user.id);

    if (accountIndex === -1) return;

    accounts[accountIndex] = {
      ...accounts[accountIndex],
      ...user,
    };
    localStorage.setItem(this.accountsKey, JSON.stringify(accounts));
  }

  private authError<T>(message: string, status = 401): Observable<T> {
    return throwError(
      () =>
        new HttpErrorResponse({
          status,
          error: { message },
        })
    );
  }
}
