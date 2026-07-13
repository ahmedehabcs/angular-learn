import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthApiService } from '../../features/auth/services/auth-api.service';

const checkAdmin = () => {
  const router = inject(Router);
  const authApi = inject(AuthApiService);

  return authApi.me().pipe(
    map((user) => user.role === 'admin' ? true : router.createUrlTree(['/'])),
    catchError(() => of(router.createUrlTree(['/login'])))
  )
};

export const adminGuard: CanActivateFn = () => checkAdmin();
export const adminChildGuard: CanActivateChildFn = () => checkAdmin();