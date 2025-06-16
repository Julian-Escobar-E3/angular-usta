// import { effect, inject, Injectable, signal } from '@angular/core';
// import { NewsService } from '@private/views/dashboard/pages/news/services/news.service';
// import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class NewsStore {
//   private http = inject(NewsService);

//   currentPage = signal(1);
//   limit = signal(6);
//   searchTerm = signal('');
//   newsList = signal<any[]>([]);
//   totalPages = signal(0);
//   visiblePages = signal<number[]>([]);

//   // Subject para búsqueda optimizada
//   private search$ = new Subject<string>();

//   constructor() {
//     effect(() => {
//       const page = this.currentPage();
//       const limit = this.limit();
//       const search = this.searchTerm();
//       this.fetchNews(page, limit, search);
//     });

//     this.search$
//       .pipe(
//         debounceTime(300),
//         distinctUntilChanged(),
//         switchMap((term) =>
//           this.http.getAll(this.currentPage(), this.limit(), term)
//         )
//       )
//       .subscribe((res) => {
//         this.newsList.set(res.data);
//         this.totalPages.set(res.totalPages);
//         this.updateVisiblePages();
//       });
//   }

//   onSearch() {
//     this.search$.next(this.searchTerm());
//   }

//   fetchNews(page: number, limit: number, search: string) {
//     this.http.getAll(page, limit, search).subscribe((res) => {
//       this.newsList.set(res.data);
//       this.totalPages.set(res.totalPages);
//       this.updateVisiblePages();
//     });
//   }

//   updateVisiblePages() {
//     const current = this.currentPage();
//     const total = this.totalPages();
//     const range = 2;

//     let start = Math.max(1, current - range);
//     let end = Math.min(total, current + range);

//     if (end - start < 4) {
//       if (current < total / 2) end = Math.min(total, start + 4);
//       else start = Math.max(1, end - 4);
//     }

//     this.visiblePages.set(
//       Array.from({ length: end - start + 1 }, (_, i) => start + i)
//     );
//   }
// }
