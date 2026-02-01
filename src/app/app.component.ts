import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthStateService } from './core/services/auth-state.service';

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private authState: AuthStateService
  ) {

  }

  ngOnInit() {
  }
}
