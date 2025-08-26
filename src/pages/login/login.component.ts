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
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}
  
  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'E-posta ve şifre gereklidir.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const uid = await this.authService.login(this.email, this.password);
      this.isLoading = false;
      this.errorMessage = '';
      this.toastr.success('Giriş başarılı!', 'Hoşgeldiniz');
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      await this.router.navigate([returnUrl]);
      setTimeout(() => { this.errorMessage = ''; }, 0);
    } catch (error) {
      this.isLoading = false;
      // Map Firebase error codes to friendly messages
      const e = error as any;
      const code: string | undefined = e && e.code ? e.code : undefined;
      const friendly = this.mapAuthError(code, e && e.message);
      this.errorMessage = friendly;
      this.toastr.error(friendly, 'Giriş başarısız');
      console.error('Login error:', error);
    }
  }

  private mapAuthError(code?: string, fallback?: string): string {
    switch (code) {
      case 'auth/wrong-password':
        return 'Şifre yanlış. Lütfen tekrar deneyin.';
      case 'auth/user-not-found':
        return 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.';
      case 'auth/invalid-email':
        return 'Geçersiz e-posta adresi.';
      case 'auth/user-disabled':
        return 'Hesabınız devre dışı bırakılmış. Destek ile iletişime geçin.';
      case 'auth/too-many-requests':
        return 'Çok fazla başarısız giriş denemesi. Lütfen bir süre sonra tekrar deneyin.';
      case 'auth/network-request-failed':
        return 'Ağ hatası. İnternet bağlantınızı kontrol edin.';
      default:
        return fallback || 'Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.';
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  
  onRegister() {
    this.router.navigate(['/uye-ol']);
  }
}
