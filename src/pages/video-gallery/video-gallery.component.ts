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
        id: 'v1',
        titleKey: 'videoGallery.videos.truckReview.title',
        descriptionKey: 'videoGallery.videos.truckReview.description',
        youtubeId: 'KBjg8KGjvCE', // Mercedes Actros kamyon incelemesi
        thumbnailUrl: 'https://img.youtube.com/vi/KBjg8KGjvCE/maxresdefault.jpg',
        category: 'trucks'
      },
      {
        id: 'v2',
        titleKey: 'videoGallery.videos.logistics.title',
        descriptionKey: 'videoGallery.videos.logistics.description',
        youtubeId: 'V8m9pTPRhpI', // Lojistik ve tedarik zinciri
        thumbnailUrl: 'https://img.youtube.com/vi/V8m9pTPRhpI/maxresdefault.jpg',
        category: 'logistics'
      },
      {
        id: 'v3',
        titleKey: 'videoGallery.videos.testimonial.title',
        descriptionKey: 'videoGallery.videos.testimonial.description',
        youtubeId: 'QH2-TGUlwu4', // Müşteri deneyimi videosu
        thumbnailUrl: 'https://img.youtube.com/vi/QH2-TGUlwu4/maxresdefault.jpg',
        category: 'testimonials'
      },
      {
        id: 'v4',
        titleKey: 'videoGallery.videos.volvoTruck.title',
        descriptionKey: 'videoGallery.videos.volvoTruck.description',
        youtubeId: 'aXQ2lO3ieBA', // Volvo kamyon tanıtımı
        thumbnailUrl: 'https://img.youtube.com/vi/aXQ2lO3ieBA/maxresdefault.jpg',
        category: 'trucks'
      },
      {
        id: 'v5',
        titleKey: 'videoGallery.videos.safety.title',
        descriptionKey: 'videoGallery.videos.safety.description',
        youtubeId: 'kLFEfQxzDzE', // Güvenli taşımacılık
        thumbnailUrl: 'https://img.youtube.com/vi/kLFEfQxzDzE/maxresdefault.jpg',
        category: 'logistics'
      },
      {
        id: 'v6',
        titleKey: 'videoGallery.videos.technology.title',
        descriptionKey: 'videoGallery.videos.technology.description',
        youtubeId: 'UYPDSqH9-PA', // Teknoloji ve takip sistemleri
        thumbnailUrl: 'https://img.youtube.com/vi/UYPDSqH9-PA/maxresdefault.jpg',
        category: 'logistics'
      },
      {
        id: 'v7',
        titleKey: 'videoGallery.videos.scaniaTruck.title',
        descriptionKey: 'videoGallery.videos.scaniaTruck.description',
        youtubeId: 'JhTLDjEQ71g', // Scania kamyon performansı
        thumbnailUrl: 'https://img.youtube.com/vi/JhTLDjEQ71g/maxresdefault.jpg',
        category: 'trucks'
      },
      {
        id: 'v8',
        titleKey: 'videoGallery.videos.customerStory.title',
        descriptionKey: 'videoGallery.videos.customerStory.description',
        youtubeId: 'nfWlot6h_JM', // Müşteri hikayesi
        thumbnailUrl: 'https://img.youtube.com/vi/nfWlot6h_JM/maxresdefault.jpg',
        category: 'testimonials'
      },
      {
        id: 'v9',
        titleKey: 'videoGallery.videos.warehousing.title',
        descriptionKey: 'videoGallery.videos.warehousing.description',
        youtubeId: 'jl7aTzBVOeg', // Depolama ve lojistik
        thumbnailUrl: 'https://img.youtube.com/vi/jl7aTzBVOeg/maxresdefault.jpg',
        category: 'logistics'
      },
      {
        id: 'v10',
        titleKey: 'videoGallery.videos.manTruck.title',
        descriptionKey: 'videoGallery.videos.manTruck.description',
        youtubeId: 'H7jtC8vjXw8', // MAN kamyon özellikleri
        thumbnailUrl: 'https://img.youtube.com/vi/H7jtC8vjXw8/maxresdefault.jpg',
        category: 'trucks'
      },
      {
        id: 'v11',
        titleKey: 'videoGallery.videos.companyTour.title',
        descriptionKey: 'videoGallery.videos.companyTour.description',
        youtubeId: 'ZUG9qYTJMsI', // Şirket turu
        thumbnailUrl: 'https://img.youtube.com/vi/ZUG9qYTJMsI/maxresdefault.jpg',
        category: 'testimonials'
      },
      {
        id: 'v12',
        titleKey: 'videoGallery.videos.sustainableLogistics.title',
        descriptionKey: 'videoGallery.videos.sustainableLogistics.description',
        youtubeId: 'ESR13zBebr8', // Sürdürülebilir lojistik
        thumbnailUrl: 'https://img.youtube.com/vi/ESR13zBebr8/maxresdefault.jpg',
        category: 'logistics'
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
