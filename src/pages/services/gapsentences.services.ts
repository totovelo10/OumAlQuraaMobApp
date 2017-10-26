import { Injectable } from '@angular/core';
import { AngularFireDatabase,AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class GapsentencesService{

  course_words:Observable<any[]>
  course_gaps_sentences:AngularFireList<any[]>
  db:AngularFireDatabase
 constructor(db: AngularFireDatabase) {
     
     this.db=db;
    
 }
getGapSentences(course:any): AngularFireList<any[]> {
    let url='/gapsentences/'
       // we select the gapsentences that have the course to true in the bdd
    this.course_gaps_sentences = this.db.list(url, ref => ref.orderByChild(course.$key).equalTo(true))
      console.log(this.course_gaps_sentences)
      return this.course_gaps_sentences;
  }
}
