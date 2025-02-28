import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLoggedIn.pipe(
      take(1),
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        }
      })
    );
  }
}