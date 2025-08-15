import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from '../../services/toastr.service';
import { SweetalertService } from '../../services/sweetalert.service';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile">
      <div class="profile-card">
        <div class="avatar" aria-hidden="true">
          <img *ngIf="profile.photoUrl" [src]="profile.photoUrl" class="avatar-img" alt="Profile photo" (error)="onImageError()" />
          <ng-container *ngIf="!profile.photoUrl">{{ profile.firstName.charAt(0) }}{{ profile.lastName.charAt(0) }}</ng-container>
        </div>
        <input #fileInput type="file" accept="image/*" style="display:none" (change)="onFileChange($event)" />
        <h2 class="name">{{ profile.firstName }} {{ profile.lastName }}</h2>
        <div class="meta">
          <p><span class="label">Mail:</span> <span class="value">{{ profile.email }}</span></p>
          <p><span class="label">Telefon:</span> <span class="value">{{ profile.phone }}</span></p>
          <p><span class="label">Dil Seçimi:</span> <span class="value">{{ profile.language }}</span></p>
          <p><span class="label">Para Birimi:</span> <span class="value">{{ profile.currency }}</span></p>
        </div>
        <div class="actions">
          <button class="btn btn-secondary" (click)="triggerFileInput()"><i class="fa fa-camera" aria-hidden="true"></i> Fotoğraf Ekle</button>
          <button class="btn btn-secondary" (click)="removePhoto()" *ngIf="profile.photoUrl"><i class="fa fa-trash" aria-hidden="true"></i> Fotoğrafı Kaldır</button>
          <button class="btn btn-secondary" (click)="goBack($event)"><i class="fa fa-arrow-left" aria-hidden="true"></i> Geri</button>
          <button class="btn btn-danger" (click)="deleteAccount($event)"><i class="fa fa-user-slash" aria-hidden="true"></i> Hesabı Sil</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile {
      display: flex;
      justify-content: center;
      /* Make the profile section fill the viewport up to the footer. The footer height
         can be adjusted via --footer-height; fallback to 96px */
      min-height: calc(100vh - var(--footer-height, 96px));
      align-items: center; /* center vertically so the card fills and centers */
      padding: 24px 16px;
      font-family: Arial, Helvetica, sans-serif;
      box-sizing: border-box;
    }

    .profile-card {
      width: 100%;
      max-width: 920px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.08);
      padding: 28px;
      text-align: center;
      /* make the card occupy the available vertical space up to the footer */
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: calc(100vh - var(--footer-height, 96px) - 48px);
      box-sizing: border-box;
    }

    .avatar {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2b74ff 0%, #5ad0ff 100%);
      color: #fff;
      font-weight: 700;
      font-size: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px auto;
      overflow: hidden;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .name {
      margin: 8px 0 12px 0;
      font-size: 22px;
      font-weight: 800; /* koyu */
      color: #222;
    }

    .meta p {
      margin: 10px 0;
      font-size: 20px; /* büyük metin */
      color: #222;
      line-height: 1.2;
    }

    .label {
      display: inline-block;
      min-width: 100px;
      text-align: right;
      margin-right: 12px;
      font-weight: 800; /* koyu label */
      font-size: 18px;
      color: #111;
    }

    .value {
      font-weight: 900;
      font-size: 20px; /* vurgulanmış değerler */
      color: #0b2545;
    }

    .actions {
      margin-top: 18px;
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .btn {
      padding: 8px 14px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 700;
    }

    .btn-secondary { background: #f0f0f0; color: #222; }
    .btn-danger { background: #ff4d4f; color: #fff; }

    @media (max-width: 480px) {
      .profile-card { padding: 20px; }
      .avatar { width: 96px; height: 96px; font-size: 28px; }
      .name { font-size: 20px; }
    }
  `]
})
export class ProfileComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  profile: { firstName: string; lastName: string; email: string; phone: string; language: string; currency: string; photoUrl?: string | null } = {
    firstName: 'Ali Can',
    lastName: 'Yucel',
    email: 'yucelalicandan@hotmail.com',
    phone: '+905416923675',
    language: 'Türkçe',
    currency: 'TRY',
    photoUrl: null
  };

  constructor(private router: Router, private toastr: ToastrService, private swal: SweetalertService) {
    // load persisted photo if present, otherwise use the requested default avatar
    try {
      const stored = localStorage.getItem('profilePhoto');
      if (stored) {
        this.profile.photoUrl = stored;
      } else {
        // default from user's request
        this.profile.photoUrl = 'https://avatars.githubusercontent.com/u/32604562?v=4';
        try { localStorage.setItem('profilePhoto', this.profile.photoUrl); } catch (e) { }
      }
    } catch (e) { }
  }

  triggerFileInput() {
    try { this.fileInput.nativeElement.click(); } catch (e) { }
  }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) { return; }
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.profile.photoUrl = dataUrl;
      try { localStorage.setItem('profilePhoto', dataUrl); } catch (e) { }
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.profile.photoUrl = null;
    try { localStorage.removeItem('profilePhoto'); } catch (e) { }
  }

  onImageError() {
    // fallback to initials if external image fails to load
    this.profile.photoUrl = null;
    try { localStorage.removeItem('profilePhoto'); } catch (e) { }
  }

  goBack(ev?: Event) {
    const target = this.createTemporaryTarget(ev);
    // show a brief SweetAlert info before navigating, positioned next to the button
    this.swal.fire({ title: 'Geri', text: 'Ana sayfaya dönülüyor', timer: 900, showConfirmButton: false, icon: 'info', target });
    setTimeout(() => {
      this.router.navigate(['/']);
      this.removeTemporaryTarget(target);
    }, 400);
  }

  deleteAccount(ev?: Event) {
    // position the modal to the left of the clicked button and show a prominent warning
    const target = this.createTemporaryTarget(ev, 'left');
    const opts: any = {
      title: 'Hesabı sil',
      text: 'Hesabınız kalıcı olarak silinecek. Devam etmek istiyor musunuz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      target
    };

    // Use swal.fire directly (ensures the `target` option is applied)
    (this.swal.fire(opts) as Promise<any>)
      .then((res: any) => {
        if (res && (res.isConfirmed || res.value === true)) {
          // placeholder: call API to delete account
          console.log('Hesap silme işlemi başlatıldı');
          // show a strong success modal
          this.swal.fire({ title: 'Silindi', text: 'Hesabınız silindi.', icon: 'success', confirmButtonColor: '#3085d6', target });
          setTimeout(() => this.router.navigate(['/']), 1200);
        }
      })
      .catch((e: any) => {
        console.warn('swal confirm error', e);
      })
      .then(() => this.removeTemporaryTarget(target));
  }

  private createTemporaryTarget(ev?: Event, position: 'above' | 'left' = 'above') {
    try {
      const el = ev && (ev.target as HTMLElement) ? (ev.target as HTMLElement) : null;
      const rect = el ? el.getBoundingClientRect() : null;
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '99999';
      // place the swal container directly above the button, centered horizontally
      if (rect) {
        if (position === 'left') {
          const left = rect.left + window.scrollX - 8; // slightly left of button
          const top = rect.top + window.scrollY + rect.height / 2;
          container.style.left = `${left}px`;
          container.style.top = `${top}px`;
          container.style.transform = 'translate(-100%, -50%)';
        } else {
          const left = rect.left + window.scrollX + rect.width / 2;
          const top = rect.top + window.scrollY - 8; // 8px gap above the button
          container.style.left = `${left}px`;
          container.style.top = `${top}px`;
          container.style.transform = 'translate(-50%, -100%)';
        }
      } else {
        container.style.right = '1rem';
        container.style.top = '1rem';
      }
      document.body.appendChild(container);
      return container;
    } catch (e) {
      return undefined;
    }
  }

  private removeTemporaryTarget(container: any) {
    try { if (container && container.parentNode) { container.parentNode.removeChild(container); } } catch (e) { }
  }
}
