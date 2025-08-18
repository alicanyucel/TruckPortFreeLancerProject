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

  constructor(private translationService: TranslationService) { }

  ngOnInit(): void {
    this.initializeVideos();
  }

  initializeVideos() {
    this.videos = [
      {
        id: 'v100',
        titleKey: 'videoGallery.videos.fravSgkXr54.title',
        descriptionKey: 'videoGallery.videos.fravSgkXr54.description',
        youtubeId: 'fravSgkXr54',
        thumbnailUrl: 'https://img.youtube.com/vi/fravSgkXr54/maxresdefault.jpg',
        category: 'trucks'
      },
      {
        id: 'v101',
        titleKey: 'videoGallery.videos.fravSgkXr54.title',
        descriptionKey: 'videoGallery.videos.fravSgkXr54.description',
        youtubeId: 'fravSgkXr54',
        thumbnailUrl: 'https://img.youtube.com/vi/fravSgkXr54/maxresdefault.jpg',
        category: 'logistics'
      },
      {
        id: 'v102',
        titleKey: 'videoGallery.videos.fravSgkXr54.title',
        descriptionKey: 'videoGallery.videos.fravSgkXr54.description',
        youtubeId: 'fravSgkXr54',
        thumbnailUrl: 'https://img.youtube.com/vi/fravSgkXr54/maxresdefault.jpg',
        category: 'testimonials'
      }
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
  }

  getFilteredVideos(): Video[] {
    if (this.selectedCategory === 'all') {
      return this.videos;
    }
    return this.videos.filter(video => video.category === this.selectedCategory);
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
