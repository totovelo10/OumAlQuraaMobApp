import { Injectable } from '@angular/core';
import { AngularFireDatabase,AngularFireList } from 'angularfire2/database';



@Injectable()
export class SentencesService {
     course_sentences:AngularFireList<any[]>
     false_sentences:AngularFireList<any[]>
     db:AngularFireDatabase
    constructor(db: AngularFireDatabase) {
        
        this.db=db;
       
    }

  getSentences(course:any): AngularFireList<any[]> {
    let url='/sentences/'
   
       // we select the sentences that have the course to true in the bdd
    this.course_sentences = this.db.list(url, ref => ref.orderByChild(course.id).equalTo(true))
        
      return this.course_sentences;
  }

  getFalseSentences(sentence:any): AngularFireList<any[]> {
    let url='/falsesentences/'
       // we select the false sentences that have the sentence to true in the bdd
    this.false_sentences =this.db.list(url, ref => ref.orderByChild(sentence.id).equalTo(true))
      return this.false_sentences;
  }

  
}