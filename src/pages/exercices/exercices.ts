import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ExercicesCoursesPage } from '../exercices/exercices-courses/exercices-courses';
import { Observable } from 'rxjs/Observable';
import { AdMobPro } from '@ionic-native/admob-pro';

@Component({
  selector: 'exercices',
  templateUrl: 'exercices.html'
})
export class ExercicesPage {
  courses: Array<any>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    db: AngularFireDatabase,
    private file: File,
    public admob: AdMobPro,
    private platform: Platform) {

      this.launchInterstitial()
      
    // we retrieve all courses
    let url = '/courses/'
    db.list(url, ref => ref.orderByChild('rank')).valueChanges().subscribe(courses => {
      this.courses = courses
      // for every directory  we check if he was created since more than two days
      for (let i = 0; i < courses.length; i++) {

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

    this.navCtrl.push(ExercicesCoursesPage, {
      course: course,
      hideback: false

    });
  }

  launchInterstitial() {
      console.log("hfdkhfk")
    let adId;
    if (this.platform.is('android')) {
      console.log('android')
      //adId = 'ca-app-pub-4224089839636849~7332813318';
      adId = 'ca-app-pub-4224089839636849/1765090585';
    }
    // prepare and load ad resource in background, e.g. at begining of game level
    if (this.admob) {
      console.log("go!")
      this.admob.prepareInterstitial({ adId: adId, isTesting: false, autoShow: true });

      // show the interstitial later, e.g. at end of game level
      if(this.admob) this.admob.showInterstitial();
    }  


 





  }





}
