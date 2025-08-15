import { Component } from '@angular/core';
import { ToastrService } from '../../services/toastr.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formModel: { name?: string; email?: string; phone?: string; subject?: string; message?: string } = {};

  constructor(private toastr: ToastrService) {}

  async onSubmit(form?: NgForm) {
    // mark all fields as touched so validation messages appear
    if (form) {
      Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());
    }

    // basic checks
    const email = this.formModel.email || '';
    const phone = this.formModel.phone || '';
    const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRe = /^[0-9]{11}$/;

    if (!emailRe.test(email)) {
      this.toastr.error('Lütfen geçerli bir e-posta adresi girin.', 'E-posta hatası');
      return;
    }

    if (!phoneRe.test(phone)) {
      this.toastr.error('Telefon numarası 11 haneli olmalıdır (sadece rakamlar).', 'Telefon hatası');
      return;
    }

    if (form && form.invalid) {
      this.toastr.error('Lütfen gerekli alanları doğru şekilde doldurun.', 'Form hatası');
      return;
    }

  // Send to server endpoint to actually deliver the mail (server must be running)

    // Send to server endpoint to actually deliver the mail (server must be running)
    try {
      const resp = await fetch((window as any).CONTACT_API_URL || '/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.formModel)
      });
      const j = await resp.json();
      if (resp.ok && j.ok) {
        this.toastr.success('Mesaj sunucuya ulaştı ve gönderildi.', 'Gönderildi');
        // reset the form and model only on confirmed success
        if (form) {
          form.resetForm();
          this.formModel = {};
        }
      } else {
        this.toastr.error('Mesaj gönderilemedi. Sunucu hatası.', 'Gönderim hatası');
        console.error('send-contact error', j);
      }
    } catch (err) {
      console.error('send-contact network error', err);
      this.toastr.error('Mesaj gönderilemedi. Ağ hatası veya sunucu çalışmıyor.', 'Gönderim hatası');
    }

  // note: form is reset only on successful send
  }
}
