import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import '@angular/compiler';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';


// Combina los providers de appConfig con los de bootstrapApplication
const combinedProviders = [
  provideHttpClient(),
  importProvidersFrom(CommonModule),
  ...appConfig.providers // Desestructura los providers de appConfig
];

bootstrapApplication(AppComponent, {
  providers: combinedProviders,
})
.catch((err) => console.error(err));