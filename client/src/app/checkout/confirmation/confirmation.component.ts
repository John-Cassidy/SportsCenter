import { Component, Input } from '@angular/core';

import { BasketCheckout } from '../../shared/models/Basket';
import { CoreComponent } from '../../core';
import { SharedComponent } from '../../shared';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent {
  @Input() confirmationCheckout: BasketCheckout | null = null;
}
