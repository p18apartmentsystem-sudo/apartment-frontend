import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authState: AuthStateService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        // ✅ DO NOT HANDLE ERRORS FOR LOGIN API
        if (req.url.includes('/auth/login')) {
          return throwError(() => error);
        }

        // ✅ UNAUTHORIZED (token expired / invalid)
        if (error.status === 401) {
          this.authState.logout();
          this.router.navigate(['/auth/login'], { replaceUrl: true });
        }

        // ✅ FORBIDDEN
        if (error.status === 403) {
          this.router.navigate(['/error/403']);
        }

        // ✅ SERVER ERROR
        if (error.status >= 500) {
          this.router.navigate(['/error/500']);
        }

        return throwError(() => error);
      })
    );
  }
}
