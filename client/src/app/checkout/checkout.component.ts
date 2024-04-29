import { Component } from '@angular/core';
import { CoreComponent } from '../core';
import { SharedComponent } from '../shared';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {}
