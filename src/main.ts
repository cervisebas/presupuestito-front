import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { register } from 'swiper/element/bundle';

register();
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
