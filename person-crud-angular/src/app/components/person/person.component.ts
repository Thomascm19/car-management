import { Component, OnInit } from '@angular/core';
import {PersonService} from "../../services/person.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Person} from "../../interfaces/person";
import {FailModalComponent} from "../shared/fail-modal/fail-modal.component";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  loading: boolean;

  constructor(public personService: PersonService, private modalService: NgbModal, private router: Router) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.getPersons();
  }

  editPerson(person: Person) {
    this.router.navigate(['/person', person.cedula]);
  }

  private getPersons() {
    this.loading = true;
    this.personService.getPersons()
      .subscribe((res: any) => {
        this.personService.persons = res as Person[];
        this.loading = false;
      }, (err) => {
        this.openModalFailLoading()
        console.log(err);
        this.loading = false;
      });
  }

  deletePerson(cedula: string) {
    this.personService.deletePerson(cedula).subscribe(
      data => {
        console.log(data);
        this.getPersons();
      },
      error => {
        console.log(error);
      }
    );
  }

  openModalFailLoading() {
    const modalRef = this.modalService.open(FailModalComponent);
    modalRef.componentInstance.message = "Error cargado los datos";
  }
}
