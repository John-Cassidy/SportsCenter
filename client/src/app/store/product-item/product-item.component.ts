import { Component, Input } from '@angular/core';

import { BasketService } from '../../basket/basket.service';
import { Product } from '../../shared/models/Product';
import { RouterModule } from '@angular/router';
import { SharedComponent } from '../../shared';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [RouterModule, SharedComponent],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  @Input() product: Product | null = null;

  constructor(private baseketService: BasketService) {}

  addItemToBasket() {
    this.product && this.baseketService.addItemToBasket(this.product);
  }
}
