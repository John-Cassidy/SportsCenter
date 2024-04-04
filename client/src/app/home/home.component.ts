import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CoreComponent } from '../core';
import { RouterOutlet } from '@angular/router';
import { SharedComponent } from '../shared';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CoreComponent, SharedComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  title = 'Sports Center';
}
