import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { OrderService } from '../../../services/order.service';
import { OrderDetails } from './order-details';

describe('OrderDetails', () => {
  let component: OrderDetails;
  let fixture: ComponentFixture<OrderDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetails],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        {
          provide: OrderService,
          useValue: {
            getOrderById: () => of({
              id: 1,
              products: [],
              total: 0,
              discountedTotal: 0,
              userId: 1,
              totalProducts: 0,
              totalQuantity: 0,
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Order #1');
  });
});
