import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, db } from './firebase.service';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'driver' | 'user';
  isAuthenticated: boolean;
  mobile?: string;
  currency?: string;
  pro_pic?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: User | null = null;

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user?.uid;
      if (!uid) throw new Error('Firebase kimlik doğrulama başarısız.');

  const snapshot = await get(ref(db, `users/${uid}`));
  const userData = snapshot && snapshot.exists() ? snapshot.val() : {};

      const user: User = {
        id: uid,
        email,
        name: userData.name || '',
        role: userData.role || 'user',
        isAuthenticated: true,
        mobile: userData.mobile || '',
        currency: userData.currency || '',
        pro_pic: userData.pro_pic || ''
      };

      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return uid;
    } catch (error: any) {
      const code = error?.code;
      switch (code) {
        case 'auth/wrong-password':
          throw new Error('Şifre yanlış. Lütfen tekrar deneyin.');
        case 'auth/user-not-found':
          throw new Error('Bu e-posta ile kayıtlı kullanıcı bulunamadı.');
        case 'auth/invalid-email':
          throw new Error('Geçersiz e-posta adresi.');
        case 'auth/user-disabled':
          throw new Error('Hesabınız devre dışı bırakılmış.');
        case 'auth/too-many-requests':
          throw new Error('Çok fazla deneme yapıldı. Lütfen biraz bekleyin.');
        case 'auth/network-request-failed':
          throw new Error('Ağ hatası. Bağlantınızı kontrol edin.');
        default:
          throw new Error(error?.message || 'Giriş sırasında bir hata oluştu.');
      }
    }
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser?.isAuthenticated || false;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }
}

