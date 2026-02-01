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
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {

                if (error.status === 401) {
                    // Unauthorized → session invalid
                    this.authState.logout();
                    this.router.navigate(['/auth/login']);
                }

                if (error.status === 403) {
                    // Forbidden → role / permission issue
                    this.router.navigate(['/error/403']);
                }

                if (error.status >= 500) {
                    // Server error
                    this.router.navigate(['/error/500']);
                }

                return throwError(() => error);
            })
        );
    }
}
