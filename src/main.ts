import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Bootstrap de la aplicación usando la configuración centralizada (routing, http, etc.)
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
