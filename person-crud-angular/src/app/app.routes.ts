import {Routes} from "@angular/router";
import {PersonComponent} from "./components/person/person.component";
import {PersonFormComponent} from "./components/person/person-form/person-form.component";
import {HomeComponent} from "./components/home/home.component";

export const ROUTES: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'person', component: PersonComponent},
  {path: 'person/personAdd', component: PersonFormComponent},
  {path: 'person/:id', component: PersonFormComponent},
  // Cualquier path vacio redirecciona al home
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  // // Cualquier otro path redireccion al home
  {path: '**', pathMatch: 'full', redirectTo: 'home'}
];
