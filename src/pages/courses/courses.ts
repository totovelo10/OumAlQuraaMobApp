import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase,AngularFireList} from 'angularfire2/database';
import { CourseDetailsPage } from '../course-details/course-details';
import { Observable } from 'rxjs/Observable';
import { Word } from '../../interfaces/word';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'courses',
  templateUrl: 'courses.html'
})
export class CoursesPage {
  courses: any[];
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    db: AngularFireDatabase,
    private storage: Storage) {
      storage.get('userId').then((val) => {
        console.log( val);
      })
    db.list('/courses').valueChanges().subscribe(cours => 
      {
        console.log(cours)
        this.courses=cours
      })
    
  }

  courseSelected(course: String){
    this.navCtrl.push(CourseDetailsPage, {
      course: course
    });
  }

}
