import { Component } from '@angular/core';
import { SentencesService } from '../../services/sentences.services'
import { NavController, NavParams } from 'ionic-angular';
import { ResultsPage } from '../results/results';
import { Sentence } from '../../../interfaces/sentence';
import { FalseSentence } from '../../../interfaces/falsentence';
//import {ExoParentPage} from '../exo-parent';
@Component({
  selector: 'correct-sentences',
  templateUrl: 'correct-sentences.html',
  providers: [SentencesService]
})

export class CorrectSentencesPage  {


  selectedCourse: any;
  course_sentences: any[];
  displayed_sentences: Sentence[];
  tmp_displayed_sentences: Sentence[];
  sentenceSearched: any;
  sentenceChoosen: any;
  note: number;
  nbproposition: number;
  maxSentences: number;
  exSentencesSearched: any[]
  userChoices: any[]
  exDisplayedSentences: Array<Sentence[]>
  falseSentences:Array<any>
  falseDisplayed:Array<FalseSentence>
  false1:FalseSentence
  answers: string[]
  whoami:string
  consigne:any

  constructor(public navCtrl: NavController, public navParams: NavParams, protected SentencesService: SentencesService) {
    // we retrive the selected course from the navigation parameters
    this.selectedCourse = navParams.get('course');
    this.sentenceSearched = {}
    this.note = 0;
    this.nbproposition = 0
    this.exSentencesSearched = [];// this tab has the sentences that were chosen before
    this.userChoices = [];
    this.exDisplayedSentences = []
    this.displayed_sentences = []
    this.falseDisplayed = []
    this.answers = []// this tab retrieve the state of the answer. If the answer is good the tab element is true else is false
    //super(navCtrl,navParams,sentencesService)
    this.consigne={french:"Choisis parmi les phrases suivantes phrase correcte",arabic:"اختر بين الجملة التالية الجملة الصحيحة"}
    this.whoami="correctsentences"
    this.false1={arabic:"",french:"",id:0}
  }

  ngOnInit(): void {
    this.getSentences(this.selectedCourse);
    console.log("sentdch " + this.sentenceChoosen)

  }
  //getSentences of a Course
  getSentences(selectedCourse): void {
    
    
    this.displayed_sentences = []
    this.tmp_displayed_sentences=[];
    let tmp_sentencesearched: any; 
    let nb:number;
    // we retrive Sentence of the selected course
    this.SentencesService.getSentences(selectedCourse).valueChanges().subscribe(sentences => {

      console.log(sentences)
      this.course_sentences = sentences;
      this.maxSentences = sentences.length;
      nb=this.getRandomNumber(this.maxSentences);
      tmp_sentencesearched = this.course_sentences[nb];
      
      /*
      we want to check if the future sentencechoosen was chosen yet
      then we pass the five sentences and the sentencechosen in temporary variables
      for check because if we did not do thath the screen would be 
      refreshed with bad sentences*/

      
      // we check if the sentencesearched chosen is not in the exsentencesearched 
      for (let i = 0; i < this.exSentencesSearched.length; i++) {
        if (this.exSentencesSearched[i].id == tmp_sentencesearched.id) {
          nb=this.getRandomNumber(this.maxSentences);
          tmp_sentencesearched = this.course_sentences[nb];
          i = -1;// because i++ comes after this line
        }

      }
      //this.displayed_sentences = tmp_displayed_sentences
      this.sentenceSearched = tmp_sentencesearched
      //this.displayed_sentences.push(this.sentenceSearched)
      this.tmp_displayed_sentences.push(this.sentenceSearched)
      console.log("tmp_Sentencesearched: " + tmp_sentencesearched.arabic)

      this.SentencesService.getFalseSentences(this.sentenceSearched).valueChanges().subscribe(sentences => {
        console.log(sentences)
        this.falseSentences=sentences;
        console.log(this.falseSentences)
        let nb2:number
        
        nb2=this.getRandomNumber(this.falseSentences.length);
        this.false1 = this.falseSentences[nb2];
        this.falseDisplayed.push(this.false1)
        
        for(let j=0;j<this.falseSentences.length;j++){
          if( this.false1.id == this.falseSentences[j].id){

          }
          else{
            this.tmp_displayed_sentences.push(this.falseSentences[j])
            this.tmp_displayed_sentences= this.shuffleArray(this.tmp_displayed_sentences)
          }
        }
       this.displayed_sentences=this.tmp_displayed_sentences
      })
    });
  }

  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
  getRandomNumber(max: number): number {
    let nb: number
    nb = Math.floor(Math.random() * max);

    return nb;
  }

  validate() {
    this.exDisplayedSentences.push(this.displayed_sentences);
    this.exSentencesSearched.push(this.sentenceSearched)
    if (this.sentenceChoosen == null) {

    }

    else {
      this.userChoices.push(this.sentenceChoosen)
      console.log(this.sentenceChoosen)
      if (this.sentenceChoosen == this.sentenceSearched) {
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
          exSentencesSearched: this.exSentencesSearched,
          userChoices: this.userChoices,
          displayedSentences: this.exDisplayedSentences,
          falseDisplayed:this.falseDisplayed,
          answers: this.answers,
          consigne:this.consigne,
          nbproposition:nbQuestion,
          whoami: this.whoami
        });
      }
      else {
        this.sentenceChoosen = null
        this.ngOnInit()
      }
    }
  }


}
export const nbQuestion = 5