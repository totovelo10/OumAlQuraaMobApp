import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class GapsentencesService{

  course_words:FirebaseListObservable<any[]>
  course_gaps_sentences:FirebaseListObservable<any[]>
  db:AngularFireDatabase
 constructor(db: AngularFireDatabase) {
     
     this.db=db;
    
 }
getGapSentences(course:any): FirebaseListObservable<any[]> {
    let url='/gapsentences/'
       // we select the gapsentences that have the course to true in the bdd
    this.course_gaps_sentences = this.db.list(url,{
        query:{
          orderByChild: course.$key,
          equalTo:true
        }
      })
      console.log(this.course_gaps_sentences)
      return this.course_gaps_sentences;
  }
}
