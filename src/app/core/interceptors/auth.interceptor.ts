import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStateService } from '../services/auth-state.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

intercept(req: HttpRequest<any>, next: HttpHandler) {

  // ✅ BYPASS LOGIN & PUBLIC APIs
  if (req.url.includes('/login') || req.url.includes('/auth/login')) {
    return next.handle(req);
  }

  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next.handle(req);
}


}
