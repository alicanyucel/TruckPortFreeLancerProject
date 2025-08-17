import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit, OnDestroy {
  title = 'Test Bileşeni';
  
  // Veriler
  bookingTrips: any[] = [];
  devices: any[] = [];

  // Auth
  authError: string | null = null;
  authUser: any = null;

  loadingTrips = true;
  loadingDevices = true;

  // Pagination
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  private subs: Subscription[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    // Booking Trips
    const s1 = this.firebaseService.getBookingTrips().subscribe({
      next: (data: any[]) => {
        this.bookingTrips = data || [];
        this.loadingTrips = false;
        this.updatePagination();
      },
      error: (error) => {
        console.error('Error fetching trips:', error);
        this.loadingTrips = false;
      }
    });
    this.subs.push(s1);

    // Devices
    const s2 = this.firebaseService.getDevices().subscribe({
      next: (data: any[]) => {
        this.devices = data || [];
        this.loadingDevices = false;
      },
      error: (error) => {
        console.error('Error fetching devices:', error);
        this.loadingDevices = false;
      }
    });
    this.subs.push(s2);

    // Auth Error
    const s3 = this.firebaseService.getAuthError$().subscribe(err => {
      this.authError = err ? err.message || String(err) : null;
    });
    this.subs.push(s3);

    // Auth State
    const s4 = this.firebaseService.getAuthState$().subscribe(u => this.authUser = u);
    this.subs.push(s4);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  trackByIndex(i: number) { return i; }

  // Pagination
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
