import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Person} from "../interfaces/person";

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  persons: Person[] = [];
  person: Person | undefined
  public userId: any;
  baseURL = 'https://localhost:7047/api/'

  constructor(private http: HttpClient) { }

  postPerson(person: any) {
    return this.http.post(this.baseURL + 'Person', person);
  }

  getPersons() {
    return this.http.get(this.baseURL + 'Person');
  }

  getPerson(cedula: any) {
    return this.http.get(this.baseURL + 'Person/' + cedula);
  }

  updatePerson(person: Person) {
    person.cedula = person.cedula.toString()
    return this.http.put(this.baseURL + 'Person/' + person.cedula, person);
  }

  deletePerson(cedula: any) {
    return this.http.delete(this.baseURL + 'Person/' + cedula);
  }

  getPersonById(id: any) {
    return this.http.get(this.baseURL + 'Person/getById/' + id);
  }
}
