import { CarouselModule } from 'ngx-bootstrap/carousel';
import { Component } from '@angular/core';
import { CoreComponent } from '../core';
import { SharedComponent } from '../shared';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CoreComponent, SharedComponent, CarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  title = 'Sports Center';
}
