import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.state';
import { selectUserName } from '../store/user/user.selectors';
import { setUser } from '../store/user/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TruckPort';
  userName$: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.userName$ = this.store.select(selectUserName);
    // Örnek: Kullanıcıyı store'a ekle
    this.store.dispatch(setUser({ name: 'Ali Can Yücel', email: 'ali@truckport.net' }));
  }
}
