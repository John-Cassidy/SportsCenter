import { Component } from '@angular/core';
import { CoreComponent } from '../core';
import { SharedComponent } from '../shared';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export class BasketComponent {}
