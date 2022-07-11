import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PersonService} from "../../../services/person.service";
import {ActivatedRoute} from "@angular/router";
import {FailModalComponent} from "../../shared/fail-modal/fail-modal.component";
import {SuccessModalComponent} from "../../shared/success-modal/success-modal.component";
import {Person} from "../../../interfaces/person";

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {
  personForm: FormGroup = new FormGroup({});
  isEditAction: boolean;
  loading: boolean;

  constructor(public personService: PersonService, public modalService: NgbModal, private route: ActivatedRoute) {
    this.loading = false;
    this.isEditAction = false;
    this.route.params.subscribe(params =>{
      this.getPerson(params['id']);
    })
  }

  ngOnInit(): void {
    this.initForm()
  }

  initForm(){
    this.personForm = new FormGroup({
      cedula: new FormControl('', [Validators.max(10), Validators.min(10)]),
      nombre: new FormControl(''),
      edad: new FormControl(''),
      fecha_Simulacion: new FormControl(''),
      iD_Persona: new FormControl(''),
      tiempo_Simulacion: new FormControl(''),
    })
  }

  savePerson() {
    this.loading = true;
    this.personService.postPerson(this.personForm.value).subscribe(
      res => {
        this.loading = false;
        this.personForm.reset();
        this.openModalSuccess()
        console.log(res);
      },
      err => {
        this.loading = false;
        this.openModalFail()
        console.log(err)
      }
    )
  }

  private getPerson(id: string) {
    if (id) {
      this.isEditAction = true;
      this.personService.getPerson(id).subscribe(
        res => {
          this.personService.person = res as Person
          if (this.personService.person.cedula.length === 2){
            this.personService.person.cedula = ''
          }
          this.personForm.patchValue(this.personService.person);
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  updatePerson() {
    this.loading = true;
    this.personService.updatePerson(this.personForm.value).subscribe(
      res => {
        this.loading = false;
        this.openModalSuccess("Persona actualizado con éxito")
        console.log(res);
      },
      err => {
        this.loading = false;
        this.openModalFail("Ha ocurrido un error al actualizar la persona")
        console.log(err);
      }
    )
  }

  openModalSuccess(message?: string) {
    const modalRef = this.modalService.open(SuccessModalComponent);
    if (message) {
      modalRef.componentInstance.message = message;
    } else {
      modalRef.componentInstance.message = 'Armamento almacenado con éxito';
    }
  }

  openModalFail(message?: string) {
    const modalRef = this.modalService.open(FailModalComponent);
    if(message) {
      modalRef.componentInstance.message = message;
    } else {
      modalRef.componentInstance.message = 'Ha ocurrido un error al guardar el armamento';
    }
  }

  getTextTitle() {
    return this.isEditAction ? 'Editar persona' : 'Registro de peronas';
  }

  getTextDescription() {
    return this.isEditAction ? 'En este modulo podras editar personas' : 'En este modulo podras agregar personas';
  }

  getTextSave() {
    return this.isEditAction ? 'Actualizar' : 'Guardar';
  }

  validForm() {
    console.log(this.personForm.valid)
  }
}
