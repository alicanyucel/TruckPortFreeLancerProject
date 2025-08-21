import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/services/firebase.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {
  providers: any[] = [];
  pagedProviders: any[] = [];
  page: number = 1;
  pageSize: number = 16;
  totalPages: number = 1;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.getProviders().subscribe((providers) => {
      this.providers = providers;
      this.totalPages = Math.ceil(this.providers.length / this.pageSize);
      this.setPagedProviders();
    });
  }

  setPagedProviders() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProviders = this.providers.slice(start, end);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.setPagedProviders();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.setPagedProviders();
    }
  }
}
