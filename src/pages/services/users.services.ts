import { Injectable } from '@angular/core';
import { ExoParentPage } from '../exercices/exo-parent';
import {AngularFireDatabase,AngularFireList} from 'angularfire2/database';
import { Observable} from 'rxjs/Observable';
import { User } from '../../interfaces/user';
import * as firebase from 'firebase';
@Injectable()
export class UsersService{
     users:Observable<any>
    user:any
     db:AngularFireDatabase 
     ref:any
    constructor(db: AngularFireDatabase ) {
        
        this.db=db;
        this.ref = firebase.database().ref
    }

  getUserById(userId:string): any{
    let url='/users/'
    let ref = firebase.database()
    
       // we retrieve the user
    this.users=this.db.list(url).valueChanges()
   //this.user = this.db.list(url, ref => ref.orderByChild('id').equalTo(userId))
   this.user=this.db.list(url,ref => ref.orderByChild('id').equalTo(1))
    
   
      return this.user;
  }

  getUserByEmail(email:string): any{
    let url='/users/'
    let ref = firebase.database()
    
       // we retrieve the user
    this.users=this.db.list(url).valueChanges()
   //this.user = this.db.list(url, ref => ref.orderByChild('id').equalTo(userId))
   this.user=this.db.list(url,ref => ref.orderByChild('email').equalTo(email))
    
   
      return this.user;
  }
  
}