import { Component,Inject } from '@angular/core';
import {ExoParentPage} from '../exo-parent';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import { WordsService } from '../../services/words.services'
import { SentencesService } from '../../services/sentences.services'
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage'
import { ToastController } from 'ionic-angular';
@Component({
  selector: 'arabic-to-french',
  templateUrl: 'arabic-to-french.html',
  providers: [WordsService,SentencesService]
})




export class ArabicToFrenchPage  extends ExoParentPage{



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    protected wordsService: WordsService,
    protected sentencesService: SentencesService,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    @Inject(FirebaseApp) firebaseApp: any) {

    super(navCtrl, navParams, wordsService,sentencesService, loading, toastCtrl,firebaseApp)
    
    this.whoami = "arabictofrench"
    
 
  }
}