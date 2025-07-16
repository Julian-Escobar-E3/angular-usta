import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'graduate-header',
  standalone: true,
  imports: [],
  templateUrl: './graduate-header.component.html',
  styleUrl: './graduate-header.component.css',
})
export class GraduateHeaderComponent {
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
