import { Component } from '@angular/core';
import { CoreComponent } from '../core';
import { SharedComponent } from '../shared';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CoreComponent,SharedComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

}
