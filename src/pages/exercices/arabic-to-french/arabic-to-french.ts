import { Component } from '@angular/core';
import { WordsService } from '../../services/words.services'
import { NavController, NavParams } from 'ionic-angular';
import {ExoParentPage} from '../exo-parent'


@Component({
  selector: 'arabic-to-french',
  templateUrl: 'arabic-to-french.html',
  providers: [WordsService]
})

export class ArabicToFrenchPage extends ExoParentPage {


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

  constructor(public navCtrl: NavController, public navParams: NavParams, protected wordsService: WordsService) {

    super(navCtrl,navParams,wordsService)
    this.whoami="arabictofrench"
  } 
}