import { Component, effect, inject, signal } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { ProfileTableColumns, ProfileTableRows } from '../../enums';
import { CommonModule } from '@angular/common';
import { EngineersService } from '../../services/engineers.service';
import { DeleteDialogService } from '@private/services/deleteDialog.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Engineer } from '../../interfaces';
import { tap } from 'rxjs';

@Component({
  selector: 'app-profiles-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TitleComponent,
    SpinnerComponent,
  ],
  templateUrl: './profiles-list.component.html',
  styles: ``,
})
export default class ProfilesListComponent {
  public columns = Object.values(ProfileTableColumns);
  public rows = Object.values(ProfileTableRows);

  currentPage = signal(1);
  limit = signal(3);
  totalPages = signal(0);
  engineerList = signal<Engineer[]>([]);
  visiblePages = signal<number[]>([]);
  isSearchActive = signal(false);

  public engineersService = inject(EngineersService);
  private _deleteDialogService = inject(DeleteDialogService);
  searchTerm: string = '';

  constructor() {
    effect(
      () => {
        const page = this.currentPage();
        const limit = this.limit();

        // Solo cargar cuando no hay búsqueda activa
        if (!this.isSearchActive()) {
          this.engineersService
            .getData(page, limit, '')
            .subscribe((response) => {
              this.engineerList.set(response.data);
              this.totalPages.set(response.totalPages);
              this.updateVisiblePages();
            });
        }
      },
      { allowSignalWrites: true }
    );
  }

  onSearch() {
    if (!this.searchTerm.trim()) return;

    this.isSearchActive.set(true);
    this.currentPage.set(1);
    this.engineersService
      .getData(this.currentPage(), this.limit(), this.searchTerm)
      .subscribe((response) => {
        this.engineerList.set(response.data);
        this.totalPages.set(response.totalPages);
        this.updateVisiblePages();
      });
  }

  onResetSearch() {
    this.searchTerm = '';
    this.isSearchActive.set(false);
    this.currentPage.set(1);
    this.engineersService
      .getData(this.currentPage(), this.limit(), '')
      .subscribe((response) => {
        this.engineerList.set(response.data);
        this.totalPages.set(response.totalPages);
        this.updateVisiblePages();
      });
  }

  updateVisiblePages() {
    const currentPage = this.currentPage();
    const totalPages = this.totalPages();
    const range = 2;

    let start = Math.max(1, currentPage - range);
    let end = Math.min(totalPages, currentPage + range);

    if (end - start < 4) {
      if (currentPage < totalPages / 2) {
        end = Math.min(totalPages, start + 4);
      } else {
        start = Math.max(1, end - 4);
      }
    }

    this.visiblePages.set(
      Array.from({ length: end - start + 1 }, (_, i) => start + i)
    );
  }

  onDelete(id: string): void {
    this._deleteDialogService.confirmDelete(
      this.engineersService.deleteEngineer(id).pipe(
        tap(() => {
          this.loadInitialNews();
        })
      ),
      ''
    );
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  loadInitialNews() {
    this.engineersService
      .getData(this.currentPage(), this.limit(), '')
      .subscribe((response) => {
        this.engineerList.set(response.data);
        this.totalPages.set(response.totalPages);
        this.updateVisiblePages();
      });
  }
}
