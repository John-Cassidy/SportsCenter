import { ConnectionRefusedComponent } from './connection-refused/connection-refused.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NotFoundComponent } from './not-found/not-found.component';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { ServerErrorComponent } from './server-error/server-error.component';

export const CoreComponent = [
  NavBarComponent,
  NotFoundComponent,
  ServerErrorComponent,
  SectionHeaderComponent,
  ConnectionRefusedComponent,
  NgxSpinnerModule,
];
