import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginData, RegisterData, AuthResponse, CurrentUser } from '../models/auth.model';


@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data);
  }

  register(data: RegisterData): Observable<AuthResponse> {    
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data);
  }

  me(): Observable<CurrentUser>{
    return this.http.get<CurrentUser>(`${this.baseUrl}/me`);
  }
}