import { Component,Inject } from '@angular/core';
import {ExoParentPage} from '../exo-parent';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import { WordsService } from '../../services/words.services'
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage'
import { ToastController } from 'ionic-angular';
@Component({
  selector: 'arabic-to-french',
  templateUrl: 'arabic-to-french.html',
  providers: [WordsService]
})




export class ArabicToFrenchPage  extends ExoParentPage{


  /*selectedCourse: any;
  course_words: any[];
  displayed_words: Word[];
  wordsearched: any;
  wordchoosen: any;
  note: number;
  nbproposition: number;
  maxWords: number;
  exWordsSearched: any[]
  userChoices: any[]
  exDisplayedWords: Array<Word[]>
  answers: string[]*/

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    protected wordsService: WordsService,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    @Inject(FirebaseApp) firebaseApp: any) {

    super(navCtrl, navParams, wordsService, loading, toastCtrl,firebaseApp)
    
    this.whoami = "arabictofrench"

  }
}