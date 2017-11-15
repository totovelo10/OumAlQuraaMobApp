import { Injectable } from '@angular/core';
import { ExoParentPage } from '../exercices/exo-parent';
import {AngularFireDatabase,AngularFireList} from 'angularfire2/database';
import { Observable} from 'rxjs/Observable';
import { User } from '../../interfaces/user';
import * as firebase from 'firebase';
@Injectable()
export class ResultsService{
     
     result:any
     db:AngularFireDatabase 
     ref:any
    constructor(db: AngularFireDatabase ) {
        
        this.db=db;
        this.ref = firebase.database().ref
    }

  getResultById(resultId:string): any{
    let url='/results/'
    let ref = firebase.database()
    
       // we retrieve the result
   
   this.result=this.db.list(url,ref => ref.orderByChild('id').equalTo(resultId))
    
   
      return this.result;
  }
  
  getResultByUserId(userId:string): any{
    let url='/results/'
    let ref = firebase.database()
    
       // we retrieve the result
   
   this.result=this.db.list(url,ref => ref.orderByChild('userId').equalTo(userId))
    
   
      return this.result;
  }
}