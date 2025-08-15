import { Injectable } from '@angular/core';

/**
 * Simple Toastr wrapper service.
 * This project may not include a dedicated toastr library; this wrapper uses
 * a minimal DOM-based approach to show toast messages. You can replace it
 * with ngx-toastr or any other library later.
 */
@Injectable({ providedIn: 'root' })
export class ToastrService {
  private containerId = 'app-toastr-container';

  constructor() {}

  private ensureContainer(): HTMLElement {
    let c = document.getElementById(this.containerId);
    if (!c) {
      c = document.createElement('div');
      c.id = this.containerId;
      c.style.position = 'fixed';
      c.style.zIndex = '9999';
      c.style.right = '1rem';
      c.style.top = '1rem';
      c.style.display = 'flex';
      c.style.flexDirection = 'column';
      c.style.gap = '0.5rem';
      document.body.appendChild(c);
    }
    return c;
  }

  show(message: string, title?: string, timeout = 4000) {
    const container = this.ensureContainer();
    const toast = document.createElement('div');
    toast.style.background = 'rgba(0,0,0,0.75)';
    toast.style.color = 'white';
    toast.style.padding = '0.6rem 0.9rem';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    toast.style.maxWidth = '320px';
    toast.style.fontSize = '0.95rem';
    toast.style.lineHeight = '1.2';

    if (title) {
      const t = document.createElement('div');
      t.style.fontWeight = '600';
      t.style.marginBottom = '0.25rem';
      t.textContent = title;
      toast.appendChild(t);
    }

    const m = document.createElement('div');
    m.textContent = message;
    toast.appendChild(m);

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-6px)';
      setTimeout(() => container.removeChild(toast), 300);
    }, timeout);
  }

  success(message: string, title?: string, timeout = 3500) {
    this.show(message, title ?? 'Başarılı', timeout);
  }

  error(message: string, title?: string, timeout = 6000) {
    this.show(message, title ?? 'Hata', timeout);
  }

  info(message: string, title?: string, timeout = 4500) {
    this.show(message, title ?? 'Bilgi', timeout);
  }
}
