import { Injectable } from '@angular/core';
import { ExoParentPage } from '../exercices/exo-parent';
import {AngularFireDatabase, AngularFireList  } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Word } from '../../interfaces/word';
import * as firebase from 'firebase';
@Injectable()
export class WordsService{
     course_words:AngularFireList<any[]>
     course_gaps_sentences:Observable<any[]>
     db:AngularFireDatabase 
     ref:any
    constructor(db: AngularFireDatabase ) {
        
        this.db=db;
        this.ref = firebase.database().ref
    }

  getWords(course:any): AngularFireList<Word[]> {
    let url='/words/'
    let ref = firebase.database().ref
       // we select the words that have the course to true in the bdd
    this.course_words = this.db.list(url, ref => ref.orderByChild(course.id).equalTo(true))
      
      return this.course_words;
  }


  
}