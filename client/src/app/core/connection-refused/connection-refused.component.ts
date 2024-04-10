import { Component } from '@angular/core';
import { SharedComponent } from '../../shared';

@Component({
  selector: 'app-connection-refused',
  standalone: true,
  imports: [SharedComponent],
  templateUrl: './connection-refused.component.html',
  styleUrl: './connection-refused.component.scss',
})
export class ConnectionRefusedComponent {}
