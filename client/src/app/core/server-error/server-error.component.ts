import { Component } from '@angular/core';
import { SharedComponent } from '../../shared';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [SharedComponent],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss',
})
export class ServerErrorComponent {}
