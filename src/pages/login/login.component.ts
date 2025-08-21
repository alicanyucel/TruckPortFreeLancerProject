import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from '../../services/toastr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}
  
  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'E-posta ve şifre gereklidir.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.errorMessage = '';
        this.toastr.success('Giriş başarılı!', 'Hoşgeldiniz');
        // Get return URL from query params or default to home
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.';
        this.toastr.error('Giriş başarısız! Lütfen bilgilerinizi kontrol edin.', 'Hata');
        console.error('Login error:', error);
      }
    });
  }
  
  onRegister() {
    this.router.navigate(['/uye-ol']);
  }
}
