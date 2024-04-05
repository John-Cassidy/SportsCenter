import { Component } from '@angular/core';
import { CoreComponent } from '../core';
import { SharedComponent } from '../shared';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  title = 'Sports Center';
}
