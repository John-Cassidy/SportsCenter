import { BreadcrumbComponent, BreadcrumbService } from 'xng-breadcrumb';

import { Component } from '@angular/core';
import { SharedComponent } from '../../shared';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [SharedComponent, BreadcrumbComponent],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SectionHeaderComponent {
  constructor(public breadCrumbService: BreadcrumbService) {}
}
