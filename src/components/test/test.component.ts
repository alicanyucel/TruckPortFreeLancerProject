import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [FirebaseService]
})
export class TestComponent implements OnInit, OnDestroy {
  title = 'Test Bileşeni';
  bookingTrips: any[] = [];
  authError: string | null = null;
  authUser: any = null;
  loading = true;

  private subs: Subscription[] = [];
  // Pagination
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    const s1 = this.firebaseService.getBookingTrips().subscribe({
      next: (data: any[]) => {
        this.bookingTrips = data || [];
  this.loading = false;
  this.updatePagination();
      },
      error: (error) => {
        console.error('Error fetching trips:', error);
        this.loading = false;
      }
    });
    this.subs.push(s1);

    const s2 = this.firebaseService.getAuthError$().subscribe(err => {
      this.authError = err ? err.message || String(err) : null;
    });
    this.subs.push(s2);

    const s3 = this.firebaseService.getAuthState$().subscribe(u => this.authUser = u);
    this.subs.push(s3);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  trackByIndex(i: number) { return i; }

  updatePagination() {
    this.currentPage = 1;
    this.totalPages = Math.max(1, Math.ceil((this.bookingTrips?.length || 0) / this.pageSize));
  }

  get pagedTrips(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return (this.bookingTrips || []).slice(start, start + this.pageSize);
  }

  setPage(p: number) {
    if (p < 1) p = 1;
    if (p > this.totalPages) p = this.totalPages;
    this.currentPage = p;
  }

  nextPage() { this.setPage(this.currentPage + 1); }
  prevPage() { this.setPage(this.currentPage - 1); }

  changePageSize(size: number) {
    this.pageSize = size;
    this.updatePagination();
  }
}
