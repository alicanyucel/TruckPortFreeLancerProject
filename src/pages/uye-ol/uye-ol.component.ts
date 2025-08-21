import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../app/models/user.model';
import { ToastrService } from '../../services/toastr.service';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
	selector: 'app-register',
	templateUrl: './uye-ol.component.html',
	styleUrls: ['./uye-ol.component.css']
})
export class RegisterComponent {
	registerForm: FormGroup;

	constructor(private fb: FormBuilder, private toastr: ToastrService) {
		this.registerForm = this.fb.group({
			balance_amount: [''],
			cc: [''],
			currency: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			fname: ['', Validators.required],
			language: ['', Validators.required],
			lname: ['', Validators.required],
			mobile: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
			name: ['', Validators.required],
			pro_pic: [''],
			rating: [''],
			status: [''],
			trips: [''],
			accept_status: [''],
			wallet: ['']
		});
	}

	onSubmit() {
		if (this.registerForm.valid) {
			const user: User = this.registerForm.value;
			this.toastr.success('Kayıt başarılı!', 'Başarılı');
			console.log('Kayıt verisi:', user);
		} else {
			this.toastr.error('Kayıt başarısız! Lütfen tüm alanları doğru doldurun.', 'Hata');
		}
	}
}
