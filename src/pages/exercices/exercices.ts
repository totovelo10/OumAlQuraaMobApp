import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ExercicesCoursesPage } from '../exercices/exercices-courses/exercices-courses';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'exercices',
  templateUrl: 'exercices.html'
})
export class ExercicesPage {
  courses: Observable<any[]>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,db: AngularFireDatabase) {
    this.courses = db.list('/courses').valueChanges();
    console.log(this.courses)
  }

  courseSelected(course: String){
    this.navCtrl.push(ExercicesCoursesPage, {
      course: course,
      hideback: false
    
    });
  }

}
