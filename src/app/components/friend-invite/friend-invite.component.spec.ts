import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendInviteComponent } from './friend-invite.component';

describe('FriendInviteComponent', () => {
  let component: FriendInviteComponent;
  let fixture: ComponentFixture<FriendInviteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendInviteComponent]
    });
    fixture = TestBed.createComponent(FriendInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
