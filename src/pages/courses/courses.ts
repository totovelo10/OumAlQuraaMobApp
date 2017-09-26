import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { CourseDetailsPage } from '../course-details/course-details';

@Component({
  selector: 'courses',
  templateUrl: 'courses.html'
})
export class CoursesPage {
  courses: FirebaseListObservable<any[]>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,db: AngularFireDatabase) {
    this.courses = db.list('/courses');
    console.log(this.courses)
  }

  courseSelected(course: String){
    this.navCtrl.push(CourseDetailsPage, {
      course: course
    });
  }
  /*icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for(let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }*/
}
