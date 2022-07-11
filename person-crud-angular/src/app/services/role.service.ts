import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  roles = ['google-oauth2|113848017946406731920']

  constructor() { }

  public isUserAdmin(sub: any) {
    return this.roles.includes(sub)
  }
}
