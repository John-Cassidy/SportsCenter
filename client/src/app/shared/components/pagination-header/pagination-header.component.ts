import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CoreComponent } from '../../../core';
import { SharedComponent } from '../..';

@Component({
  selector: 'app-pagination-header',
  standalone: true,
  imports: [CommonModule, CoreComponent, SharedComponent],
  templateUrl: './pagination-header.component.html',
  styleUrl: './pagination-header.component.scss',
})
export class PaginationHeaderComponent {
  @Input() totalCount: number = 0; // 35
  @Input() pageNumber: number = 0; // 0
  @Input() pageSize: number = 0; // 10
}
