import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams,Content } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { CourseDetailsPage } from '../course-details/course-details';
import { Observable } from 'rxjs/Observable';
import { Word } from '../../interfaces/word';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { ToastController } from 'ionic-angular';
@Component({
  selector: 'courses',
  templateUrl: 'courses.html'
})
export class CoursesPage {
  @ViewChild(Content) content: Content;
  courses: any[];
  db2: AngularFireDatabase
  connexion :any
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    db: AngularFireDatabase,
    private storage: Storage,
    private file: File,
    private toastCtrl: ToastController) {
      db.object(".info/connected").valueChanges().subscribe(connected => {
        console.log(connected);
        this.connexion=connected
      })
    storage.get('userId').then((val) => {
      console.log(val);
    })
    this.db2 = db
    let url='/courses/'
    db.list(url, ref => ref.orderByChild('rank')).valueChanges().subscribe(cours => {
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

 /* courseSelected(course: String) {

      if (this.connexion){
        this.navCtrl.push(CourseDetailsPage, {
          course: course
        });
      }
      else{
        this.presentToast()
      }
  }*/

    courseSelected(course: String) {

        this.navCtrl.push(CourseDetailsPage, {
          course: course
        });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Choisissez une réponse parmi les propositions',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
  ionViewDidEnter(): void {
    
            this.content.resize()
        }

}



