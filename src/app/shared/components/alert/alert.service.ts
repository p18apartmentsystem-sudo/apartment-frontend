import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AlertData {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject = new Subject<AlertData | null>();
  alert$ = this.alertSubject.asObservable();

  show(message: string, type: AlertData['type'] = 'info') {
    this.alertSubject.next({ message, type });
  }

  close() {
    this.alertSubject.next(null);
  }
}
