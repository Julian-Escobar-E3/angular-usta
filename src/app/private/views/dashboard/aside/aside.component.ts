import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { DomUtilsService } from './services/domUtils.service';
import { ToggleSidebarService } from './services/toggleSidebar.service';
import { ImagePipe } from '@shared/pipes/image.pipe';
import IMenuOptions from './interfaces/sidebar.interface';
import { SidebarOptionsService } from './services/sidebarOptions.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [CommonModule, RouterLink, ImagePipe, RouterLinkActive],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export default class AsideComponent implements OnInit {
  private readonly _toggleSidebarService = inject(ToggleSidebarService);
  private readonly _domUtilsSerice = inject(DomUtilsService);

  sidebarOptions: IMenuOptions[] = [];
  private readonly _sidebarService = inject(SidebarOptionsService);

  private readonly _router = inject(Router);

  private initToggleSidebar(): void {
    this._domUtilsSerice.on('click', '.toggle-sidebar-btn', (event: Event) => {
      document.body.classList.toggle('toggle-sidebar');
    });
  }

  toggleSidebar() {
    this._toggleSidebarService.toggle();
  }
  routeIsActive(path: string): boolean {
    const actualRoute = `admin/${path}`;
    return this._router.isActive(actualRoute, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
  ngOnInit(): void {
    this._sidebarService.getSidebarOptions().subscribe((options) => {
      this.sidebarOptions = options;
    });
    this.initToggleSidebar();
  }
}
