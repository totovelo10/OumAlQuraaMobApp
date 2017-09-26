import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ExercicesCoursesPage } from '../exercices/exercices-courses/exercices-courses';

@Component({
  selector: 'exercices',
  templateUrl: 'exercices.html'
})
export class ExercicesPage {
  courses: FirebaseListObservable<any[]>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,db: AngularFireDatabase) {
    this.courses = db.list('/courses');
    console.log(this.courses)
  }

  courseSelected(course: String){
    this.navCtrl.push(ExercicesCoursesPage, {
      course: course,
      hideback: false
    
    });
  }

}
