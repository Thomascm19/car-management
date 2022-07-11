import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {DOCUMENT} from "@angular/common";
import {Router} from "@angular/router";
import {PersonService} from "../../../services/person.service";
import {HomeComponent} from "../../home/home.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(@Inject(DOCUMENT) public document: Document,
              public auth: AuthService,
              private router: Router,
              public personService: PersonService,) { }

  ngOnInit(): void {
  }

  redirectToProfile() {
    this.router.navigate(['/person', this.personService.userId]);
  }
}
