import { Component } from '@angular/core';
import { WordsService } from '../../services/words.services'
import { NavController, NavParams } from 'ionic-angular';
import { ResultsPage } from '../results/results';
import { Word } from '../../../interfaces/word';
//import {ExoParentPage} from '../exo-parent';
@Component({
  selector: 'french-to-arabic',
  templateUrl: 'french-to-arabic.html',
  providers: [WordsService]
})

export class FrenchToArabicPage {


  selectedCourse: any;
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
  answers: string[]
  whoami: string

  constructor(public navCtrl: NavController, public navParams: NavParams, protected wordsService: WordsService) {
    // we retrive the selected course from the navigation parameters
    this.selectedCourse = navParams.get('course');
    this.wordsearched = {}
    this.note = 0;
    this.nbproposition = 0
    this.exWordsSearched = [];// this tab has the words that were chosen before
    this.userChoices = [];
    this.exDisplayedWords = []
    this.answers = []// this tab retrieve the state of the answer. If the answer is good the tab element is true else is false
    //super(navCtrl,navParams,wordsService)
    this.whoami = "frenchtoarabic"
  }
  //getWords of a Course
  getWords(selectedCourse): void {
    let tmp_displayed_words: any[];
    let tmp_wordsearched: any;
    // we retrive word of the selected course
    this.wordsService.getWords(selectedCourse).subscribe(words => {
      this.course_words = words;
      this.maxWords = words.length;
      /*
      we want to check if the future wordchoosen was chosen yet
      then we pass the five words and the wordchosen in temporary variables
      for check because if we did not do thath the screen would be 
      refreshed with bad words*/

      tmp_displayed_words = this.getFiveWords(this.maxWords);// here we choose five words of the selected course
      tmp_wordsearched = this.getSearchedWord(tmp_displayed_words)// here we chose a word between the five
      for (let i = 0; i < this.exWordsSearched.length; i++) {
        //console.log("exwordsearched: " + this.exWordsSearched[i].french)
      }
      //console.log("tmp_wordsearched: " + tmp_wordsearched.french)
      // we check if the wordsearched chosen is not in the exwordsearched 
      for (let i = 0; i < this.exWordsSearched.length; i++) {
        if ((this.exWordsSearched[i].french == tmp_wordsearched.french) && (this.exWordsSearched[i].arabic == tmp_wordsearched.arabic)) {
          tmp_displayed_words = this.getFiveWords(this.maxWords);
          tmp_wordsearched = this.getSearchedWord(tmp_displayed_words)

          i = -1;// because i++ comes after this line
        }

      }
      this.displayed_words = tmp_displayed_words
      this.wordsearched = tmp_wordsearched
    });

  }



  ngOnInit(): void {
    this.getWords(this.selectedCourse);
    console.log("wodch " + this.wordchoosen)

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
    /*let maxIndex: number
    maxIndex = max - 1
    let nbmax = 0;
    if (maxIndex >= 5)
      nbmax = 5
    else nbmax = maxIndex + 1
    console.log(maxIndex)*/
    for (let i = 0; i < 5; i++) {

      nb = this.getRandomNumber(max)
      console.log(nb)
      if (tabnumbers.includes(nb)) {
        i--;
      }
      else {
        tabnumbers.push(nb)
        tabwords[i] = this.course_words[nb]
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

  // chose randomly a word between five
  getSearchedWord(tab: any[]): any {
    let nbr: number
    let wrd: any
    nbr = this.getRandomNumber(tab.length) // the tab index is 0 1 2 3 4
    wrd = tab[nbr];

    return tab[nbr];
  }

  validate() {
    this.exDisplayedWords.push(this.displayed_words);
    this.exWordsSearched.push(this.wordsearched)
    if (this.wordchoosen == null) {

    }

    else {
      this.userChoices.push(this.wordchoosen)
      console.log(this.wordchoosen)
      if (this.wordchoosen == this.wordsearched) {
        this.note++
        this.answers.push("checkmark-circle-outline")
      }
      else {
        this.answers.push("flash")
      }
      this.nbproposition++
      if (this.nbproposition == nbQuestion) {
        this.navCtrl.push(ResultsPage, {
          note: this.note,
          course: this.selectedCourse,
          exWordsSearched: this.exWordsSearched,
          userChoices: this.userChoices,
          displayedWords: this.exDisplayedWords,
          answers: this.answers,
          whoami: 'frenchtoarabic'
        });

        // console.log("Finiiito!!!")
      }
      else this.ngOnInit()//this.getWords(this.selectedCourse);

    }
  }


  /*
  we retrive sentences of the chapter from the server
  in the sentences we have words to search ex: هذا
  we display 5  sentences one by one
  the wordsearched is replace by a an input and when we click on the input
  the user has a choice between words 
  the user click on the word and the word is diplayed in the input in a specific color
  the user validate and pass to the other sentence
  finally the user is redirected to result page
  then correction page

  sentence={arabic:string, french:string,}
  exotrou{liste des mots pour le trou, liste des phrases sans trous, listes des phrases avec trous }

  en bdd
  table fillgaps 
  fillgaps1{
    gaps1:true
    gaps2:true
    gaps3:true
    
  }


  table gaps
 gaps1 {
    sentecnce_complete: fkfkfkfkf
    sentence_gapsed: dfkdkfld
    gaps_word:sds
    chapter2:true
  }



  exGapsSentence:GapSentence

  getGapsSetences(selectedCourse){
    let tmp_gapsentence: any;

    this.sentencesService.getGapsSentences(selectedCourse).subscribe(sentences => {
      this.course_gapsentences = sentences;
      this.maxsentences = sentences.length;
      let nb: number;
      nb = this.getRandomNumber(max)

      tmp_gaps_sentence = this.course_gapsentences[nb]

      for (let i = 0; i < this.exGapsSentence.length; i++) {
        if ((this.exGapsSentence[i].french == tmp_gaps_sentence.french) && (this.exGapsSentence[i].arabic == tmp_gaps_sentence.arabic)) {
          tmp_gaps_sentence = this.getSentence(this.course_gapsentences)
          i = -1;// because i++ comes after this line
        }

      }
      this.gaps_sentence = tmp_gaps_sentence
    });

  }

  getRandomNumber(max: number): number {
    let nb: number
    nb = Math.floor(Math.random() * max);

    return nb;
  }

  validate() {
    this.exDisplayedWords.push(this.displayed_words);
    this.exWordsSearched.push(this.wordsearched)
    if (this.wordchoosen == null) {

    }

  
  
  */




}
export const nbQuestion = 5