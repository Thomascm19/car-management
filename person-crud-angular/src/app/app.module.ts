import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PersonComponent } from './components/person/person.component';
import { PersonFormComponent } from './components/person/person-form/person-form.component';
import { FailModalComponent } from './components/shared/fail-modal/fail-modal.component';
import { SuccessModalComponent } from './components/shared/success-modal/success-modal.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ROUTES} from "./app.routes";
import {HttpClientModule} from "@angular/common/http";
import { LoadingComponent } from './components/shared/loading/loading.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import {AuthModule} from "@auth0/auth0-angular";
import { FooterComponent } from './components/shared/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { MiniGameComponent } from './components/mini-game/mini-game.component';
import {AppService} from "./services/app.service";
import {GameService} from "./services/game.service";

@NgModule({
  declarations: [
    AppComponent,
    PersonComponent,
    PersonFormComponent,
    FailModalComponent,
    SuccessModalComponent,
    LoadingComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    MiniGameComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AuthModule.forRoot({
      domain: 'dev-f0-7ttm0.us.auth0.com',
      clientId: '27WDgnq23hzzCliFsZXwQDj29gfFqlbY'
    }),
    RouterModule.forRoot(ROUTES, { useHash: true, relativeLinkResolution: 'legacy' }),
    ReactiveFormsModule
  ],
  providers: [AppService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
