import { Component } from '@angular/core';
import { CoreComponent } from '../../core';
import { SharedComponent } from '../../shared';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CoreComponent, SharedComponent],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent {}
