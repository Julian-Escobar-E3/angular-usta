import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.authService.theUser());

  isAuthenticated = computed(
    () => this.authService.authStatus() === 'authenticated'
  );

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
