import { TestBed } from '@angular/core/testing';

import { OrderServiceTs } from './order.service.js';

describe('OrderServiceTs', () => {
  let service: OrderServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
