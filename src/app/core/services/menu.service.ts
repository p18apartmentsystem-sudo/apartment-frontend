import { Injectable } from '@angular/core';
import { MENU_ITEMS } from '../config/menu.config';
import { AuthStateService } from './auth-state.service';
import { MenuItem } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {

  constructor(private authState: AuthStateService) {}

  getMenu(): MenuItem[] {
    const role = this.authState.getRole();
    return MENU_ITEMS.filter(item =>
      role && item.roles.includes(role)
    );
  }
}
