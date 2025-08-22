import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CookieService {
  setCookie(name: string, value: string, days = 365) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
  }

  getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
  }

  deleteCookie(name: string) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }

  listCookies(): { [key: string]: string } {
    const out: { [key: string]: string } = {};
    if (!document.cookie) return out;
    const parts = document.cookie.split(';');
    parts.forEach(p => {
      const [k, ...v] = p.split('=');
      if (!k) return;
      out[k.trim()] = decodeURIComponent((v || []).join('=').trim());
    });
    return out;
  }
}
