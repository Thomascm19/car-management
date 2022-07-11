import {Component, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {RoleService} from "../../services/role.service";
import {PersonService} from "../../services/person.service";
import {Person} from "../../interfaces/person";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showSimulation: boolean = false;

  constructor(public authService: AuthService, public roleService: RoleService, public personService: PersonService) { }

  ngOnInit(): void {
    if (this.personService.persons.length === 0){
      this.getPersons()
    }
    this.authService.user$.subscribe(
      res => (
        this.addNewUser(res)
      )
    )
  }

  private getPersonByID() {
    this.authService.user$.subscribe(
      res => (
        this.findUser(res)
      )
    )
  }

  private findUser(res: any | null | undefined) {
    if (res){
      this.personService.getPersonById(res.sub).subscribe(
        res => (
          this.getUserCedula(res)
        )
      )
    }
  }

  getUserCedula(res: any) {
    if (res){
      this.personService.userId = res.cedula
    }
  }


  savePerson(sub: string, name: string) {
    this.personService.postPerson({
      "iD_Persona": sub,
      "nombre": name,
      "cedula": Math.floor((Math.random() * 100) + 1).toString(),
      "tiempo_Simulacion": '',
      "fecha_Simulacion": ''

    }).subscribe(
      res => {
        this.getPersonByID()
      },
      err => {
        console.log(err)
      }
    )
  }

  private getPersons() {
    this.personService.getPersons()
      .subscribe((res: any) => {
        this.personService.persons = res as Person[];
      }, (err) => {
        console.log(err);
      });
  }

  private addNewUser(res: any | null | undefined) {
    if(res){
     this.savePerson(res.sub, res.name)
    }
  }

  startSimulation() {
    this.showSimulation = !this.showSimulation
  }
}
