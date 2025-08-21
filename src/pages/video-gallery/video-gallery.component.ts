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
  categories = ['all', 'education', 'fun', 'news'];
  selectedCategory = 'all';
  videos: Video[] = [];
  pagedVideos: Video[] = [];
  currentPage = 1;
  totalPages = 1;
  selectedVideo: Video | null = null;

  constructor(private translationService: TranslationService) { }

  ngOnInit(): void {
    this.initializeVideos();
  }

  initializeVideos() {
    this.videos = [
      {
        id: '1',
        titleKey: 'video1.title',
        descriptionKey: 'video1.desc',
        youtubeId: 'abc123',
        thumbnailUrl: 'https://img.youtube.com/vi/abc123/0.jpg',
        category: 'education'
      },
      {
        id: '2',
        titleKey: 'video2.title',
        descriptionKey: 'video2.desc',
        youtubeId: 'def456',
        thumbnailUrl: 'https://img.youtube.com/vi/def456/0.jpg',
        category: 'fun'
      }
      // ...daha fazla video eklenebilir
    ];
    this.pagedVideos = this.videos;
    this.totalPages = Math.ceil(this.videos.length / 9);
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'all') {
      this.pagedVideos = this.videos;
    } else {
      this.pagedVideos = this.videos.filter(v => v.category === category);
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  getCategoryName(category: string): string {
    const names: any = {
      all: 'Tümü',
      education: 'Eğitim',
      fun: 'Eğlence',
      news: 'Haber'
    };
    return names[category] || category;
  }

  getVideoTitle(key: string): string {
    return this.translationService.translate(key);
  }

  getVideoDescription(key: string): string {
    return this.translationService.translate(key);
  }

  selectVideo(video: Video) {
    this.selectedVideo = video;
  }

  closeVideoModal() {
    this.selectedVideo = null;
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * 9;
    const end = start + 9;
    this.pagedVideos = this.videos.slice(start, end);
    this.totalPages = Math.ceil(this.videos.length / 9);
  }
}
