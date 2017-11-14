import { Component, ViewChild } from '@angular/core';
import {UsersService} from '../services/users.services';
import {User} from '../../interfaces/user'
import {Content } from 'ionic-angular';
import { Observable} from 'rxjs/Observable';
import {AngularFireDatabase,AngularFireList} from 'angularfire2/database';

@Component({
    selector: 'progression',
    templateUrl: 'progression.html',
    providers: [UsersService]
  })
  export class ProgressionPage {
    user:AngularFireList<User>
    @ViewChild(Content) content: Content;
    
    constructor(private usersServices:UsersService) {
       this.user=this.usersServices.getUserById('1').valueChanges().subscribe(
        user => {
          console.log(user)
          this.user = user[0]
        }
      )
       
        }
//refresh the content size
        ionViewDidEnter(): void {
            
            this.content.resize()
        }
        
        
  }