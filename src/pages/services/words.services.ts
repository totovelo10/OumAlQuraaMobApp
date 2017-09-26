import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';



@Injectable()
export class WordsService {
     course_words:FirebaseListObservable<any[]>
     db:AngularFireDatabase
    constructor(db: AngularFireDatabase) {
        
        this.db=db;
       
    }

  getWords(course:any): FirebaseListObservable<any[]> {
    let url='/words/'
       // we select the words that have the course to true in the bdd
    this.course_words = this.db.list(url,{
        query:{
          orderByChild: course.$key,
          equalTo:true
        }
      })
      return this.course_words;
  }
}