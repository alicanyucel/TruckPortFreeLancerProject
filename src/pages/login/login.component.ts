import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  onLogin() {
    alert('Giriş yapılıyor...');
  }
  
  onRegister() {
    alert('Kayıt sayfasına yönlendiriliyorsunuz...');
  }
}
