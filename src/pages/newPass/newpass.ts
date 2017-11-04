import { Component } from '@angular/core';
@Component({
    selector: 'newpass',
    templateUrl: 'newpass.html'
  })
  export class NewPassPage {

    email:string
    
    constructor() {
        this.email="";
        }
  }