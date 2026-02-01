import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationCancel } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../core/layout.service';
import { AuthStateService } from 'src/app/core/services/auth-state.service';
import { MenuComponent } from '../../../kt/components';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  private unsubscribe: Subscription[] = [];

  role!: string;
  headerTitle = 'P18';

  appSidebarDefaultCollapseDesktopEnabled!: boolean;
  appSidebarDisplay!: boolean;
  appHeaderDefaulMenuDisplay!: boolean;
  headerContainerCssClass = '';
  flat_details: string;
  user_details: any;

  constructor(
    private layout: LayoutService,
    private authState: AuthStateService,
    private router: Router
  ) {
    this.routingChanges();
  }

  ngOnInit(): void {

    /* Layout config */
    const layoutSub = this.layout.layoutConfigSubject.subscribe(config => {

      this.appSidebarDefaultCollapseDesktopEnabled =
        this.layout.getProp(
          'app.sidebar.default.collapse.desktop.enabled',
          config
        ) as boolean;

      this.appSidebarDisplay =
        this.layout.getProp('app.sidebar.display', config) as boolean;

      this.appHeaderDefaulMenuDisplay =
        this.layout.getProp(
          'app.header.default.menu.display',
          config
        ) as boolean;

      const container =
        this.layout.getProp('appHeaderDefaultContainer', config);

      this.headerContainerCssClass =
        container === 'fixed' ? 'container-xxl' : 'container-fluid';
    });

    this.unsubscribe.push(layoutSub);

    /* User / Role */
    const user = this.authState.getUser();
    this.role = user?.role;

    if (this.role === 'super_admin') {
      this.headerTitle = 'P18';
    } else {
      this.headerTitle = user?.apartmentId?.name || 'Apartment';
      this.flat_details = user?.flatId?.flatNumber || '';
      this.user_details = user?.name  || ''
    }
  }

  routingChanges() {
    const routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        MenuComponent.reinitialization();
      }
    });
    this.unsubscribe.push(routerSub);
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }
}
