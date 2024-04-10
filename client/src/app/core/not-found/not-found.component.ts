import { Component } from '@angular/core';
import { SharedComponent } from '../../shared';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [SharedComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
