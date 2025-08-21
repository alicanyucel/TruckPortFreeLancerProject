import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../app/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './uye-ol.component.html',
  styleUrls: ['./uye-ol.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
submitted: any;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      cc: ['+90'],
      currency: ['TRY:₺'],
      language: [''],
      pro_pic: [''],
      balance_amount: ['0'],
      rating: ['0.0'],
      status: ['0'],
      trips: [''],
      accept_status: ['0'],
      wallet: ['0.0']
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData: User = this.registerForm.value;
      console.log('Kullanıcı verisi:', userData);
      // API'ye gönderilebilir
    } else {
      console.log('Form geçerli değil');
    }
  }
}
