import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

interface Video {
  id: string;
  titleKey: string;
  descriptionKey: string;
  youtubeId: string;
  thumbnailUrl: string;
  category: string;
}

@Component({
  selector: 'app-video-gallery',
  templateUrl: './video-gallery.component.html',
  styleUrls: ['./video-gallery.component.css']
})
export class VideoGalleryComponent implements OnInit {
  videos: Video[] = [];
  selectedVideo: Video | null = null;
  categories: string[] = ['all', 'trucks', 'logistics', 'testimonials'];
  selectedCategory: string = 'all';

  // Pagination
  pageSize = 9;
  currentPage = 1;

  constructor(private translationService: TranslationService) { }

  ngOnInit(): void {
    this.initializeVideos();
  }

  initializeVideos() {
    this.videos = [
      ...Array.from({ length: 18 }, (_, i) => ({
        id: `trucks${i}`,
        titleKey: 'videoGallery.videos.fravSgkXr54.title',
        descriptionKey: 'videoGallery.videos.fravSgkXr54.description',
        youtubeId: 'fravSgkXr54',
        thumbnailUrl: 'https://img.youtube.com/vi/fravSgkXr54/maxresdefault.jpg',
        category: 'trucks'
      })),
      ...Array.from({ length: 18 }, (_, i) => ({
        id: `logistics${i}`,
        titleKey: 'videoGallery.videos.fravSgkXr54.title',
        descriptionKey: 'videoGallery.videos.fravSgkXr54.description',
        youtubeId: 'fravSgkXr54',
        thumbnailUrl: 'https://img.youtube.com/vi/fravSgkXr54/maxresdefault.jpg',
        category: 'logistics'
      })),
      ...Array.from({ length: 18 }, (_, i) => ({
        id: `testimonials${i}`,
        titleKey: 'videoGallery.videos.fravSgkXr54.title',
        descriptionKey: 'videoGallery.videos.fravSgkXr54.description',
        youtubeId: 'fravSgkXr54',
        thumbnailUrl: 'https://img.youtube.com/vi/fravSgkXr54/maxresdefault.jpg',
        category: 'testimonials'
      }))
    ];
  }

  selectVideo(video: Video) {
    this.selectedVideo = video;
  }

  closeVideoModal() {
    this.selectedVideo = null;
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
  }

  getFilteredVideos(): Video[] {
    if (this.selectedCategory === 'all') {
      return this.videos;
    }
    return this.videos.filter(video => video.category === this.selectedCategory);
  }

  get pagedVideos(): Video[] {
    const filtered = this.getFilteredVideos();
    const start = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.getFilteredVideos().length / this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getCategoryName(category: string): string {
    return this.translationService.translate(`videoGallery.categories.${category}`);
  }

  getVideoTitle(titleKey: string): string {
    return this.translationService.translate(titleKey);
  }

  getVideoDescription(descriptionKey: string): string {
    return this.translationService.translate(descriptionKey);
  }
}
