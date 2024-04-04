import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  LowerCasePipe,
  PercentPipe,
  SlicePipe,
  UpperCasePipe,
} from '@angular/common';

import { Provider } from '@angular/core';

export const COMMON_PIPES: Provider[] = [
  DatePipe,
  UpperCasePipe,
  LowerCasePipe,
  CurrencyPipe,
  PercentPipe,
  DecimalPipe,
  JsonPipe,
  SlicePipe,
];
