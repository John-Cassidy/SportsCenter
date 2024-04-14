import { BasketService } from '../../basket/basket.service';
import { COMMON_COMPONENTS } from '../components';
import { COMMON_DIRECTIVES } from '../directives';
import { COMMON_PIPES } from '../pipes';
import { Component } from '@angular/core';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [COMMON_COMPONENTS, COMMON_DIRECTIVES, COMMON_PIPES],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
})
export class OrderSummaryComponent {
  constructor(public basketService: BasketService) {}

  // Create a method to update shipment price and total
  updateShipmentAndTotal(): void {
    // this.basketService.calculateShippingAndTotal();
  }
}
