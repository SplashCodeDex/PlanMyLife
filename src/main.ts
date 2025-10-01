import { bootstrapApplication } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { register } from 'swiper/element/bundle';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from '@environments/environment';

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

register();

const firebaseConfig = environment.firebase; // Corrected to environment.firebase

const app = initializeApp(firebaseConfig);

if (!environment.production) {
  const auth = getAuth(app);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');

  const firestore = getFirestore(app);
  connectFirestoreEmulator(firestore, '127.0.0.1', 8080);

  const storage = getStorage(app);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}

if (environment.production) {
  // Enable production mode is handled automatically in Angular 19
}

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
}).catch(err => console.error(err));
