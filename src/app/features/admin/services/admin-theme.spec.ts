import { TestBed } from '@angular/core/testing';

import { AdminTheme } from './admin-theme';

describe('AdminTheme', () => {
  let service: AdminTheme;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminTheme);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
