import { UpdateProfilComponent } from 'src/app/modals/update-profil/update-profil.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire/compat';

@NgModule({
  declarations: [AppComponent, UpdateProfilComponent],
  imports: [
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      BrowserModule,
      IonicModule.forRoot({
          scrollPadding: false,
          scrollAssist: false
      }),
      AppRoutingModule,
      ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
      AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
     { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
