import { Component,Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { User } from '../../interfaces/user'
import { Word } from '../../interfaces/word'
import { Observable } from 'rxjs/Observable';
import { DownloadService } from '../services/download.services'
import { FrenchToArabicPage } from '../exercices/french-to-arabic/french-to-arabic';
import { ArabicToFrenchPage } from '../exercices/arabic-to-french/arabic-to-french';
import { DictationWordsPage } from '../exercices/dictation-words/dictation-words';
import { ImageToArabicPage } from '../exercices/image-to-arabic/image-to-arabic';
import { SoundWordsToFrenchPage } from '../exercices/sound-words-to-french/sound-words-to-french';
import { CorrectSentencesPage } from '../exercices/correct-sentences/correct-sentences';
import { DynamicComponentHostDirective } from '../directive-host'
import { Storage } from '@ionic/storage';
@Component({
    selector: 'evaluation',
    templateUrl: 'evaluation.html',
    providers:[DownloadService]
})


export class EvaluationPage{
    user: User
    exoPages: Array<any>
    pageChoosen: any
    arabictofrench:boolean
    wordsUnit:Array<any>
    wordsAF:Array<any>
 
   
  
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private storage: Storage,
        private downloadService: DownloadService) {
        
 
       this.user = { id: "", email: "", firstname: "", lastname: "", kunya: "",currentunit:"" }
        this.storage.get('user').then((user) => {
            console.log('here')
            if (user !== null) {
                this.user = user
                console.log(user.currentunit)
                //we download the elements from the level (currentunit ) of the user
                //create the files that contains the words, sounds, images
                this.wordsUnit=this.downloadService.downloadEvaluationElement(user.currentunit)
                
                
            }
          


        })

        
    }

    getFiveWords(max): any[] {
        /*
        we want to retrieve randomly five words from the words of the course
        so we prepare a tabwords which will be return the five words
        a tabnumbers which is keep the index choosen randomly
        number is the random
        max is the this.courses_words length
        maxIndex is the index max of this.course_words
        we check if number includes a nb it seems that the word is choosen yet
        so we avoid the double*/
         
          let tabwords: any[] = [];
          let tabnumbers: number[] = []
          let nb: number;
         
         for (let i = 0; i < 5; i++) {
       
            nb = this.getRandomNumber(max)
            console.log(nb)
            if (tabnumbers.includes(nb)) {
              i--;
            }
            else {
              tabnumbers.push(nb)
              tabwords[i] = this.wordsUnit[nb]
            }
          }
          console.log(tabnumbers)
          return tabwords
        }

    
    getRandomNumber(max: number): number {
        let nb: number
        nb = Math.floor(Math.random() * max);

        return nb;
    }

    // chose randomly a Page
    getChooseWords(tab: any[]): any {
        let nbr: number
        let wrd: any
        nbr = this.getRandomNumber(tab.length) 
       // wrd = tab[nbr];

        return tab[nbr];
    }

}
