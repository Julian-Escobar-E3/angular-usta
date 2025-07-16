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
import { ToastrService } from 'ngx-toastr';
import { IMessageResponse } from '@shared/interfaces/message-response.interface';
import Swal from 'sweetalert2';

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
  private _toastService = inject(ToastrService);

  searchTerm: string = '';

  constructor() {
    effect(
      () => {
        const page = this.currentPage();
        const limit = this.limit();

        // Solo cargar cuando no hay búsqueda activa
        if (!this.isSearchActive()) {
          this.graduatesService
            .getData(page, limit, '')
            .subscribe((response) => {
              this.graduatesList.set(response.data);
              this.totalPages.set(response.totalPages);
              this.updateVisiblePages();
            });
        }
      },
      { allowSignalWrites: true }
    );
  }

  // ✅ Optimizado para que el Subject maneje la búsqueda
  onSearch() {
    if (!this.searchTerm.trim()) return;

    this.isSearchActive.set(true);
    this.currentPage.set(1);
    this.graduatesService
      .getData(this.currentPage(), this.limit(), this.searchTerm)
      .subscribe((response) => {
        this.graduatesList.set(response.data);
        this.totalPages.set(response.totalPages);
        this.updateVisiblePages();
      });
  }

  onResetSearch() {
    this.searchTerm = '';
    this.isSearchActive.set(false);
    this.currentPage.set(1);
    this.graduatesService
      .getData(this.currentPage(), this.limit(), '')
      .subscribe((response) => {
        this.graduatesList.set(response.data);
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
      this.graduatesService.deleteGraduate(id).pipe(
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
    this.graduatesService
      .getData(this.currentPage(), this.limit(), '')
      .subscribe((response) => {
        this.graduatesList.set(response.data);
        this.totalPages.set(response.totalPages);
        this.updateVisiblePages();
      });
  }

  //*

  // Manejo de archivos
  selectedFile: File | null = null;
  validated: boolean = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.validated = false;
      Swal.fire('Archivo cargado', this.selectedFile.name, 'info');
    }
  }

  onDownloadTemplate() {
    this.graduatesService.downloadTemplate().subscribe(() => {
      Swal.fire('Plantilla descargada', '', 'success');
    });
  }

  onValidateCSV() {
    if (!this.selectedFile) {
      Swal.fire('Error', 'No hay archivo seleccionado para validar', 'error');
      return;
    }

    Swal.fire({
      title: 'Validando...',
      text: 'Estamos validando el archivo.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    this.graduatesService.validateCSV(this.selectedFile).subscribe({
      next: () => {
        this.validated = true;
        Swal.fire('Validación exitosa', 'El archivo es válido.', 'success');
      },
      error: (err) => {
        Swal.fire('Error de validación', err.message || '', 'error');
      },
    });
  }

  onUploadCSV() {
    if (!this.selectedFile) {
      Swal.fire(
        'Archivo no seleccionado',
        'Selecciona un archivo CSV.',
        'warning'
      );
      return;
    }

    if (!this.validated) {
      Swal.fire(
        'Validación requerida',
        'Debes validar el archivo antes de cargarlo.',
        'info'
      );
      return;
    }

    Swal.fire({
      title: 'Cargando...',
      text: 'Procesando el archivo...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    this.graduatesService.uploadCSV(this.selectedFile).subscribe({
      next: (res) => {
        Swal.fire('Éxito', res.message.ES, 'success').then(() => {
          this.reloadList(); // recarga los datos
          this.selectedFile = null;
          this.validated = false;
        });
      },
      error: (err) => {
        Swal.fire('Error al cargar', err.message || '', 'error');
      },
    });
  }

  onExportCSV() {
    this.graduatesService.exportCSV().subscribe((blob) => {
      this.graduatesService.downloadFile(blob, 'graduados_exportados.csv');
      Swal.fire('Exportación completa', '', 'success');
    });
  }

  reloadList() {
    this.isSearchActive.set(false);
    this.searchTerm = '';
    this.graduatesService
      .getData(this.currentPage(), this.limit(), '')
      .subscribe((res) => {
        this.graduatesList.set(res.data);
        this.totalPages.set(res.totalPages);
        this.updateVisiblePages();
      });
  }
}
