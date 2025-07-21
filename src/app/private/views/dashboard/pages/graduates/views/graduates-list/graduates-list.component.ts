import { Component, computed, effect, inject, signal } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { GraduatesService } from '../../services/graduates.service';
import { CommonModule } from '@angular/common';
import { GraduatesTableColumns, GraduatesTableRows } from '../../enums';
import { RouterLink } from '@angular/router';
import { DeleteDialogService } from '@private/services/deleteDialog.service';
import { tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-graduates-list',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    RouterLink,
    FormsModule,
    SpinnerComponent,
  ],
  templateUrl: './graduates-list.component.html',
  styleUrl: './graduates-list.component.css',
})
export default class GraduatesListComponent {
  public columns = Object.values(GraduatesTableColumns);
  public rows = Object.values(GraduatesTableRows);

  currentPage = signal(1);
  limit = signal(5);
  totalPages = signal(0);
  graduatesList = signal<any[]>([]);
  visiblePages = signal<number[]>([]);
  isSearchActive = signal(false);

  public graduatesService = inject(GraduatesService);
  private _deleteDialogService = inject(DeleteDialogService);

  searchTerm: string = '';

  // CSV Upload
  selectedFile: File | null = null;
  uploading = signal(false);
  uploadError = '';

  constructor() {
    effect(
      () => {
        const page = this.currentPage();
        const limit = this.limit();
        if (!this.isSearchActive()) {
          this.graduatesService.getData(page, limit, '').subscribe((res) => {
            this.graduatesList.set(res.data);
            this.totalPages.set(res.totalPages);
            this.updateVisiblePages();
          });
        }
      },
      { allowSignalWrites: true }
    );
  }

  // Buscar
  onSearch() {
    if (!this.searchTerm.trim()) return;
    this.isSearchActive.set(true);
    this.currentPage.set(1);
    this.graduatesService
      .getData(1, this.limit(), this.searchTerm)
      .subscribe((res) => {
        this.graduatesList.set(res.data);
        this.totalPages.set(res.totalPages);
        this.updateVisiblePages();
      });
  }

  onResetSearch() {
    this.searchTerm = '';
    this.isSearchActive.set(false);
    this.currentPage.set(1);
    this.graduatesService.getData(1, this.limit(), '').subscribe((res) => {
      this.graduatesList.set(res.data);
      this.totalPages.set(res.totalPages);
      this.updateVisiblePages();
    });
  }

  // CRUD
  onDelete(id: string): void {
    this._deleteDialogService.confirmDelete(
      this.graduatesService
        .deleteGraduate(id)
        .pipe(tap(() => this.reloadList())),
      ''
    );
  }

  // Navegación
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
  }
  nextPage() {
    if (this.currentPage() < this.totalPages())
      this.currentPage.set(this.currentPage() + 1);
  }
  previousPage() {
    if (this.currentPage() > 1) this.currentPage.set(this.currentPage() - 1);
  }

  updateVisiblePages() {
    const current = this.currentPage();
    const total = this.totalPages();
    const range = 2;
    let start = Math.max(1, current - range);
    let end = Math.min(total, current + range);
    if (end - start < 4) {
      if (current < total / 2) end = Math.min(total, start + 4);
      else start = Math.max(1, end - 4);
    }
    this.visiblePages.set(
      Array.from({ length: end - start + 1 }, (_, i) => start + i)
    );
  }

  reloadList() {
    this.graduatesService
      .getData(this.currentPage(), this.limit(), '')
      .subscribe((res) => {
        this.graduatesList.set(res.data);
        this.totalPages.set(res.totalPages);
        this.updateVisiblePages();
      });
  }

  // CSV
  onDownloadTemplate() {
    this.graduatesService.downloadTemplate().subscribe((blob) => {
      this.graduatesService.downloadFile(blob, 'plantilla_egresados.csv');
      Swal.fire('Plantilla descargada', '', 'success');
    });
  }

  onExportCSV() {
    this.graduatesService.exportCSV().subscribe((blob) => {
      this.graduatesService.downloadFile(blob, 'graduados_exportados.csv');
      Swal.fire('Exportación completa', '', 'success');
    });
  }

  openUploadModal() {
    const modal = new bootstrap.Modal(document.getElementById('uploadModal')!);
    modal.show();
    this.selectedFile = null;
    this.uploadError = '';
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || file.type !== 'text/csv') {
      this.uploadError = 'Solo se permiten archivos CSV';
      return;
    }
    this.selectedFile = file;
    this.uploadError = '';
  }

  validateAndUpload() {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.uploading.set(true);

    this.graduatesService.validateCSV(formData).subscribe({
      next: () => {
        this.graduatesService.uploadCSV(formData).subscribe({
          next: () => {
            this.uploading.set(false);
            document.getElementById('uploadModal')?.click();
            this.reloadList();
            Swal.fire('Importación exitosa', '', 'success');
          },
          error: (err) => {
            this.uploading.set(false);
            this.uploadError = err?.error?.message || 'Error al importar CSV';
          },
        });
      },
      error: (err) => {
        this.uploading.set(false);
        this.uploadError = err?.error?.message || 'CSV inválido';
      },
    });
  }
}
