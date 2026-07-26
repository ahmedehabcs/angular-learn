import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthApiService } from '../../services/auth-api.service';
import { Profile } from './profile';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        {
          provide: AuthApiService,
          useValue: {
            me: () =>
              of({
                id: '1',
                fullName: 'Test User',
                email: 'test@example.com',
                role: 'customer',
              }),
            updateProfile: () =>
              of({
                id: '1',
                fullName: 'Test User',
                email: 'test@example.com',
                role: 'customer',
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the user profile', () => {
    const fullNameInput = fixture.nativeElement.querySelector(
      '#fullName'
    ) as HTMLInputElement;

    expect(component).toBeTruthy();
    expect(fullNameInput.value).toBe('Test User');
  });
});
