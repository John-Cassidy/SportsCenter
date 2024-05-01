import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { CoreComponent } from '../core';
import { OrderSummaryComponent } from '../shared/order-summary/order-summary.component';
import { SharedComponent } from '../shared';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CoreComponent, SharedComponent, OrderSummaryComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const url = `checkout/address`;
    this.router.navigate(['address'], { relativeTo: this.route });
  }
}
