import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { CourseDetailsPage } from '../course-details/course-details';
import { Observable } from 'rxjs/Observable';
import { Word } from '../../interfaces/word';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
@Component({
  selector: 'courses',
  templateUrl: 'courses.html'
})
export class CoursesPage {
  courses: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    db: AngularFireDatabase,
    private storage: Storage,
    private file: File) {
    storage.get('userId').then((val) => {
      console.log(val);
    })
    db.list('/courses').valueChanges().subscribe(cours => {
      console.log(cours)
      this.courses = cours



      // for every directory  we check if he was created since more than two days
      for (let i = 0; i < cours.length; i++) {

        let fileUrl = this.file.externalDataDirectory + "/" + this.courses[i].title

        this.file.resolveLocalFilesystemUrl(fileUrl).then(
          (file) => {
            file.getMetadata(
              (meta) => this.success(meta, this.file.externalDataDirectory, this.courses[i].title), error => console.log(error))
          }

        )
      }
      //file.file(meta => console.log(meta), error => console.log(error));
    });

  }



  success(metadata: any, fileUrl, filename) {


    console.log("Last Modified: " + metadata.modificationTime);
    let fin = Date.now()

    let delta = fin - metadata.modificationTime

    console.log(delta)
    // if the files were created more than 2 days ago we delete it
    if (delta > 86400000) {
      console.log(fileUrl)
      console.log(filename)
      this.file.removeRecursively(fileUrl, filename)
    }
  }
  courseSelected(course: String) {
    this.navCtrl.push(CourseDetailsPage, {
      course: course
    });
  }

}
