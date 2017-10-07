import { Component} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FrenchToArabicPage } from '../french-to-arabic/french-to-arabic';
import { ArabicToFrenchPage } from '../arabic-to-french/arabic-to-french';
import { ImageToArabicPage } from '../image-to-arabic/image-to-arabic';
import { SoundWordsToFrenchPage } from '../sound-words-to-french/sound-words-to-french';
import { DictationWordsPage } from '../dictation-words/dictation-words';
import { FillGapsPage } from '../fillgaps/fillgaps';

@Component({
    selector: 'exercices-courses',
    templateUrl: 'exercices-courses.html'
  })

  export class ExercicesCoursesPage {
    exercices: Array<{title: string, component: any}>;
    selectedCourse:any;
    hideback:boolean
    constructor(public navCtrl: NavController, public navParams: NavParams) {
      
        // we retrive the selected course from the navigation parameters
        this.selectedCourse = navParams.get('course');
        console.log(this.selectedCourse)
        this.hideback=navParams.get('hideback')
        console.log('hiiiiddddde'+this.hideback)
        // set our app's pages
        this.exercices = [
          { title: 'Du français à l\'arabe', component: FrenchToArabicPage },
          { title: 'De l\'arabe au français', component: ArabicToFrenchPage},
          { title:'Images', component: ImageToArabicPage },
          { title:'Sons', component: SoundWordsToFrenchPage },
          { title:'Dictée', component:DictationWordsPage },
          { title:'Texte à trous', component:FillGapsPage }
          
        ];
      }

    openExo(exo) {
        // navigate to the new exo 
        this.navCtrl.push(exo.component,{
            course: this.selectedCourse
          });
      }

     
  }