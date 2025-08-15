import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SweetalertService {
  constructor() {}

  fire(options: any) {
    if ((Swal as any).fire) {
      return (Swal as any).fire(options);
    }
    return (Swal as any)(options);
  }

  confirm(title: string, text?: string, confirmButtonText = 'Evet', cancelButtonText = 'İptal') {
    const opts = {
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText,
      cancelButtonText
    };
    if ((Swal as any).fire) { return (Swal as any).fire(opts); }
    return (Swal as any)(opts);
  }

  success(title: string, text?: string) {
    const opts = { title, text, icon: 'success' };
    if ((Swal as any).fire) { return (Swal as any).fire(opts); }
    return (Swal as any)(opts);
  }

  error(title: string, text?: string) {
    const opts = { title, text, icon: 'error' };
    if ((Swal as any).fire) { return (Swal as any).fire(opts); }
    return (Swal as any)(opts);
  }
}
