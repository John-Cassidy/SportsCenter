# Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Commands

- [Angular.dev](https://angular.dev/)

- [Angular CLI Cheat Sheet 1](https://www.digitalocean.com/community/tutorials/angular-angular-cli-reference)

- [Angular CLI Cheat Sheet 2](https://pankaj-kumar.medium.com/angular-cli-cheat-sheet-the-cli-command-an-angular-developer-should-know-42fad81992c9)

- [Angular CLI Cheat Sheet 3](https://malcoded.com/posts/angular-fundamentals-cli/#cheat-sheet)

```powershell

# install node_modules
npm install

# run frontend application
npx ng serve
# or
npm start //(default npm script inside package.json)

npx ng s --p <port no> --h <hostname>

# Some other helpful commands
ng lint # To lint and look for JavaScript errors
ng lint --format stylish # Linting and formatting the output
ng lint --fix # Lint and attempt to fix all the problems
ng build # to build a project in the dist folder
ng build ---target  # Target for which we want to build
ng build --prod # To build in production mode
ng test # To run spec files
ng test --codeCoverage --watch=false
ng e2e # To run e2e test cases
ng doc # To look for angular documentation
ng help # To get help on angular cli commands

# Components
ng generate component  # To generate new component
ng g c  # Short notation to generate component
ng g c  --flat # Want to generate folder name as well?
ng g c  --inline-template # Want to generate HTML file?
ng g c  -it # Short notation
ng g c  --inline-style # Want to generate css file?
ng g c  -is # Short notation
ng g c  --standalone  # Whether the generated component is standalone.
ng g c  --view-encapsulation # View encapsulation stratergy
ng g c  -ve # Short notation
ng g c  --change-detection # Change detection strategy
ng g c  --dry-run # To only report files and don't write them
ng g c  -d # Short notation
ng g c  -m  -d

# Name of module where we need to add component as dependency
Directives and services

ng generate directive  # To generate directive
ng g d  # short notation
ng g d  -d # To only report files and don't write them
ng generate service  # To generate service
ng g s  # short notation
ng g s  -d # To only report files and don't write them
ng g s  -m


# Name of module where we need to add service as dependency
Classes, Interface, pipe, and enums

ng generate class  # To generate class
ng g cl  # short notation
ng generate interface  # To generate interface
ng g i  # short notation
ng generate pipe  # To generate pipe
ng g p  # short notation
ng generate enum  # To generate enum
ng g e  # short notation


# Module and Routing
ng generate module  # To generate module

ng g m  # To short notation
ng g m  --skipTests trus -d # To skip generate spec file for the module
ng g m  --routing # To generate module with routing file
ng g guard  # To generate guard to route

```

## HttpClientModule

file: app.config.ts

```ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()],
};
```

## CoreComponent SharedComponent StoreComponent

[How to use Shared Elements without using a Module](https://medium.com/@zayani.zied/angular-application-based-on-standalone-components-with-lazy-loading-and-shared-elements-417f36682968)

CoreComponent SharedComponent StoreComponent can be created for applications using Standalone components.

### create CoreComponent and NavBar component Instructions

Create folder: ~/app/core/

Create index.ts (Barrel) file

```powershell
New-Item -Path . -Name "index.ts" -ItemType "file"
```

```ts
// Add CoreComponent to index.ts file
export const CoreComponent = [];
```

```ts
// Add CoreComponent to app.component.ts file
import { Component } from '@angular/core';
import { CoreComponent } from './core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CoreComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'client';
}
```

#### NavBar

```powershell
# Create NavBar component in core folder
npx ng g c core/navBar --skip-tests=true --dry-run
```

```ts
// Add NavBar to CoreComponent to index.ts file
export const CoreComponent = [];
```

### create SharedComponent Instructions

NOTE: Do same for StoreComponent

Create folders:

- ~/app/shared/
- ~/app/shared/components/
- ~/app/shared/directives/
- ~/app/shared/models/
- ~/app/shared/pipes/

Create index.ts (Barrel) file in each shared folder and each subfolder

```powershell
New-Item -Path . -Name "index.ts" -ItemType "file"

```

Export elements in the barrel (index.ts)

```typescript
import { Provider } from "@angular/core";
import { OrderSummaryComponent } from "./order-summary/order-summary.component";

export const COMMON_COMPONENTS: Provider[] = [
    OrderSummaryComponent,
];


import { Provider } from "@angular/core";
import { NgIf,NgFor } from "@angular/common";

export const COMMON_DIRECTIVES: Provider[] = [
    --- common directives
];


import { Provider } from "@angular/core";

export const COMMON_PIPES: Provider[] = [
  --- common pipes
];
```

In index.ts file inside the shared directory, re-export all our common elements.

```typescript
import { COMMON_COMPONENTS } from './components';
import { COMMON_DIRECTIVES } from './directives';
import { COMMON_PIPES } from './pipes';

export const SHARED = [COMMON_COMPONENTS, COMMON_DIRECTIVES, COMMON_PIPES];
```

Import shared elements throughout the entire application.

```typescript
import { SHARED } from './shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SHARED],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
```

### create StoreComponent Instructions

StoreComponent, StoreService, Routes

standalone components ng generate component store --route store --component store

```powershell
npx ng g c store --standalone --skip-tests=true --dry-run
CREATE src/app/store/store.component.html (21 bytes)
CREATE src/app/store/store.component.ts (243 bytes)
CREATE src/app/store/store.component.scss (0 bytes)

npx ng g s store/store --flat --skip-tests --dry-run

#create store/store.routes.ts
New-Item -Path ./src/app/store -Name "store.routes.ts" -ItemType "file"

# create store/product-item component
npx ng g c store/product-item --standalone --skip-tests --dry-run
```

## NGX-Bootstrap Pagination

[Documentation](https://valor-software.com/ngx-bootstrap/#/components/pagination?tab=overview)

NOTE: since this project uses standalone components, import module into store component and add importProvidersFrom(PaginationModule.forRoot()) to app.config.ts. In addition, you need to import PaginationModule into the standalone component where it will be used.

## Angular Routing

```powershell
npx ng g c home --standalone --skip-tests=true --dry-run

npx ng g c shared/components/pagination-header --standalone --skip-tests=true --dry-run

npx ng g c shared/components/pagination --standalone --skip-tests=true --dry-run

npx ng g c store/product-details --standalone --skip-tests=true --dry-run
```

## Error Interceptor

[HttpInterceptors - Standalone Applications](https://medium.com/@bhargavr445/angular-httpinterceptors-standalone-applications-part-5-dd855f052d45)

```powershell

# example of creating function based interceptor:
# - export const errorInterceptor: HttpInterceptorFn
npx ng g interceptor core/interceptors/error --functional --skip-tests --dry-run

# example of creating class based interceptor:
# - export class ErrorInterceptor implements HttpInterceptor
npx ng g interceptor core/interceptors/error --functional=false --skip-tests --dry-run

npx ng g c core/not-found --standalone --skip-tests --dry-run
npx ng g c core/unauthenticated --skip-tests --dry-run
npx ng g c core/server-error --standalone --skip-tests --dry-run
```

## UI Components

```powershell
# ToastR component
npm i ngx-toastr
# Header Component
npx ng g c core/header --skip-tests --dry-run

# install xng-breadcrumb package
npm i xng-breadcrumb --legacy-peer-deps

# install ngx-spinner
npm i ngx-spinner --legacy-peer-deps

# example of creating function based interceptor:
# - export const loadingInterceptor: HttpInterceptorFn
npx ng g interceptor core/interceptors/loading --functional --skip-tests --dry-run

# LoadingService
npx ng g s core/services/loading --skip-tests --dry-run
```

## NGX-Bootstrap Carousel

[Documentation](https://valor-software.com/ngx-bootstrap/#/components/pagination?tab=overview)

NOTE: since this project uses standalone components, import module into store component and add importProvidersFrom(CarouselModule.forRoot()) to app.config.ts. In addition, you need to import CarouselModule into the standalone component where it will be used.

## Basket

### create BasketComponent Instructions

BasketComponent, BasketService, Routes, OrderSummaryComponent

```powershell
npx ng g c basket --standalone --skip-tests=true --dry-run
CREATE src/app/basket/basket.component.html (22 bytes)
CREATE src/app/basket/basket.component.ts (247 bytes)
CREATE src/app/basket/basket.component.scss (0 bytes)

npx ng g s basket/basket --flat --skip-tests --dry-run

#create basket/basket.routes.ts
New-Item -Path . -Name "basket.routes.ts" -ItemType "file"

npx ng g c shared/order-summary --skip-tests --dry-run
CREATE src/app/shared/order-summary/order-summary.component.html (29 bytes)
CREATE src/app/shared/order-summary/order-summary.component.ts (274 bytes)
CREATE src/app/shared/order-summary/order-summary.component.scss (0 bytes)
```

## Identity Server Client Implementation

Integrate IdentityServer into UI:

- Account Component, Account Service
- Account Routing
- Server Side Changes
- Checkout Flow
- Can Activate Route Guard
- Package.json changes
- Silent Callback
- Changes to:

  - Basket Service
  - Checkout Component
  - NavBar

- 401 Error Interceptor
- Checkout giving 400 Error

Account Component, Account Service

```powershell
npx ng g c account --standalone --skip-tests=true --dry-run
CREATE src/app/account/account.component.html (23 bytes)
CREATE src/app/account/account.component.ts (251 bytes)
CREATE src/app/account/account.component.scss (0 bytes)

npx ng g s account/account --flat --skip-tests --dry-run

#create account/account.routes.ts
New-Item -Path . -Name "account.routes.ts" -ItemType "file"

npx ng g c account/login --standalone --skip-tests=true --dry-run
CREATE src/app/account/login/login.component.html (21 bytes)
CREATE src/app/account/login/login.component.ts (243 bytes)
CREATE src/app/account/login/login.component.scss (0 bytes)

npx ng g c account/register --standalone --skip-tests=true --dry-run
CREATE src/app/account/register/register.component.html (24 bytes)
CREATE src/app/account/register/register.component.ts (255 bytes)
CREATE src/app/account/register/register.component.scss (0 bytes)
```

Checkout Component, Checkout Service

```powershell
npx ng g c checkout --standalone --skip-tests=true --dry-run
CREATE src/app/checkout/checkout.component.html (24 bytes)
CREATE src/app/checkout/checkout.component.ts (255 bytes)
CREATE src/app/checkout/checkout.component.scss (0 bytes)

npx ng g s checkout/checkout --flat --skip-tests --dry-run


#create checkout/checkout.routes.ts
New-Item -Path . -Name "checkout.routes.ts" -ItemType "file"
```

Authentication Workflow

```powershell
# install oidc-client package
npm i oidc-client --legacy-peer-deps
```

```powershell
npx ng g s account/acnt --flat --skip-tests --dry-run
CREATE src/app/account/acnt.service.ts (142 bytes)

npx ng g c account/signin-redirect-callback --standalone -t -s --skip-tests --dry-run

npx ng g c account/signout-redirect-callback.component --standalone -t -s --skip-tests --dry-run

npx ng generate guard core/guards/auth --flat --skip-tests --dry-run
? Which type of guard would you like to create? CanActivate
CREATE src/app/core/guards/auth.guard.ts (133 bytes)
```
