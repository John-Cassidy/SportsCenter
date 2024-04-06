import { Component } from '@angular/core';
import { CoreComponent } from '..';
import { SharedComponent } from '../../shared';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {}
