import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register and login with an email', async () => {
    await firstValueFrom(
      service.register({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
    );

    const response = await firstValueFrom(
      service.login({
        email: 'test@example.com',
        password: 'password123',
      })
    );

    expect(response.accessToken).toContain('local-token');
    expect(response.user?.email).toBe('test@example.com');
  });
});
