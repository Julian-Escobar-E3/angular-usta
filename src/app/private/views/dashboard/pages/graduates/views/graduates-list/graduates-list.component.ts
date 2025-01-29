import { Component, inject, OnInit } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { GraduatesService } from '../../services/graduates.service';
import { CommonModule } from '@angular/common';
import { GraduatesTableColumns, GraduatesTableRows } from '../../enums';
import { RouterLink } from '@angular/router';
import { DeleteDialogService } from '@private/services/deleteDialog.service';

@Component({
  selector: 'app-graduates-list',
  standalone: true,
  imports: [CommonModule, TitleComponent, RouterLink],
  templateUrl: './graduates-list.component.html',
  styleUrl: './graduates-list.component.css',
})
export default class GraduatesListComponent implements OnInit {
  public graduatesService = inject(GraduatesService);

  public columns = Object.values(GraduatesTableColumns);
  public rows = Object.values(GraduatesTableRows);

  public offset: number = 0;
  public limit: number = 6;
  public currentPage: number = 1; // Número de la página actual

  private _deleteDialogService = inject(DeleteDialogService);

  ngOnInit(): void {
    this.loadGraduates();
  }

  loadGraduates() {
    this.graduatesService.getGraduates(this.offset, this.limit);
  }
  goToNextPage() {
    if (this.graduatesService.graduatesListhasMore()) {
      this.offset += this.limit;
      this.currentPage += 1; // Incrementar la página actual
      this.loadGraduates();
    }
  }

  goToPreviousPage() {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.currentPage -= 1; // Decrementar la página actual
      this.loadGraduates();
    }
  }

  onDelete(id: string): void {
    this._deleteDialogService.confirmDelete(
      this.graduatesService.deleteGraduate(id!),
      '/admin/graduates'
    );
  }
}
