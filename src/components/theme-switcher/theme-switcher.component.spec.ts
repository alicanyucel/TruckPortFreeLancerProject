import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSwitcherComponent } from './theme-switcher.component';
import { ThemeService } from '../../services/theme.service';
import { BehaviorSubject } from 'rxjs';

describe('ThemeSwitcherComponent', () => {
  let component: ThemeSwitcherComponent;
  let fixture: ComponentFixture<ThemeSwitcherComponent>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ThemeService', ['setTheme', 'getCurrentTheme']);
    spy.currentTheme$ = new BehaviorSubject('light' as any);

    await TestBed.configureTestingModule({
      declarations: [ ThemeSwitcherComponent ],
      providers: [
        { provide: ThemeService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeSwitcherComponent);
    component = fixture.componentInstance;
    mockThemeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown', () => {
    expect(component.isDropdownOpen).toBeFalse();
    component.toggleDropdown();
    expect(component.isDropdownOpen).toBeTrue();
  });

  it('should select theme', () => {
    component.onThemeSelect('dark');
    expect(mockThemeService.setTheme).toHaveBeenCalledWith('dark');
    expect(component.isDropdownOpen).toBeFalse();
  });
});
