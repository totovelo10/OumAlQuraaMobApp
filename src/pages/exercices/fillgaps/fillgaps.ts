import { Component } from '@angular/core';
import { WordsService } from '../../services/words.services'
import { GapsentencesService } from '../../services/gapsentences.services'

import { NavController, NavParams } from 'ionic-angular';
import { ResultsPage } from '../results/results';
import { Gapsentence } from '../../../interfaces/gapsentence';
//import {ExoParentPage} from '../exo-parent';
@Component({
  selector: 'fillgaps',
  templateUrl: 'fillgaps.html',
  providers: [GapsentencesService]
})

export class FillGapsPage {


  selectedCourse: any;
  note: number;
  nbproposition: number;
  answers: string[]
  whoami: string
  course_gapsentences: Array<Gapsentence>
  missingWords: Array<String>
  missword1: string
  missword2: string
  missword3: string
  gaps_sentence: Gapsentence
  exGapsSentence: Array<Gapsentence>
  propositionslist: Array<string>
  userChoices: Array<string>

  constructor(public navCtrl: NavController, public navParams: NavParams, protected gapsentencesServices: GapsentencesService) {
    // we retrive the selected course from the navigation parameters
    this.selectedCourse = navParams.get('course');
    this.gaps_sentence = { chapter: "", missingword1: "", missingword2: null, missingword3: null, sentencegapsed: "" }
    this.propositionslist = []
    this.note = 0;
    this.nbproposition = 0
    this.exGapsSentence = [];// this tab has the sentences that were chosen before
    this.answers = []// this tab retrieve the state of the answer. If the answer is good the tab element is true else is false
    //super(navCtrl,navParams,wordsService)
    this.whoami = "fillgaps"
    this.userChoices = [];
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
  then correction page*/


  ngOnInit(): void {
    this.getGapsSetences(this.selectedCourse);


  }
  getGapsSetences(selectedCourse) {
    let tmp_gapsentence: Gapsentence;
    let max: number;
    this.gapsentencesServices.getGapSentences(selectedCourse).subscribe(gapsentences => {
      this.course_gapsentences = gapsentences;
      max = this.course_gapsentences.length;
      console.log(gapsentences)
      for (let i = 0; i < max; i++) {
        this.propositionslist.push(this.course_gapsentences[i].missingword1)
        if (this.course_gapsentences[i].missingword2 === undefined) {

        }
        else {
          this.propositionslist.push(this.course_gapsentences[i].missingword2)
          if (this.course_gapsentences[i].missingword3 === undefined) {

          }
          else {
            this.propositionslist.push(this.course_gapsentences[i].missingword3)
          }
        }

      }
      let nb: number;
      nb = this.getRandomNumber(max)

      tmp_gapsentence = this.course_gapsentences[nb]


      for (let i = 0; i < this.exGapsSentence.length; i++) {
        if (this.exGapsSentence[i].sentencegapsed == tmp_gapsentence.sentencegapsed) {
          nb = this.getRandomNumber(max)
          tmp_gapsentence = this.course_gapsentences[nb]
          i = -1;// because i++ comes after this line
        }

      }
      this.gaps_sentence = tmp_gapsentence
    });

  }

  getRandomNumber(max: number): number {
    let nb: number
    nb = Math.floor(Math.random() * max);

    return nb;
  }

  validate() {

    this.exGapsSentence.push(this.gaps_sentence);
    if (this.missword1 == null) {// if the first input is not informed no move

    }
    else { //if the first input is informed check if it is equal to this.gaps_sentence.missingword1
      if (this.gaps_sentence.missingword1 != this.missword1) {// if not we can pass to the next sentence
        this.nbproposition++
        this.isTimetoGo();
        this.userChoices.push(this.missword1)
        this.ngOnInit();
      }
      else { // but if it equals we check if the sentence has a second input
        this.userChoices.push(this.missword1)//add user choice 
        if (this.gaps_sentence.missingword2 === undefined) {// if it have not a second input 
          //we pass to the next question
          this.nbproposition++
          this.note++
          this.isTimetoGo();
          this.ngOnInit();
        }
        else { // if it have a second input 
          // we check if it is informed if not  no move
          if (this.missword2 == null) {
          }
          else {
            //if the second input is informed check if it equals to this.gaps_sentence.missingword2
            if (this.gaps_sentence.missingword2 != this.missword2) { //if not we can pass to the next sentence
              this.userChoices.push(this.missword2)
              this.nbproposition++
              this.isTimetoGo();
              this.ngOnInit();
            }
            else { // but if it equals we check if the sentence has a third input
              this.userChoices.push(this.missword2)
              if (this.gaps_sentence.missingword3 === undefined) {// if it have not a third input we pass to the next question
                this.nbproposition++
                this.note++
                this.isTimetoGo();
                this.ngOnInit();
              }
              else {// if it have a third input 
                // we check if it is informed if not  no move
                if (this.missword3 == null) {
                }
                else {
                  //if the third input is informed check if it equals to this.gaps_sentence.missingword3
                  if (this.gaps_sentence.missingword3 != this.missword3) { //if not we can pass to the next sentence
                    this.userChoices.push(this.missword3)
                    this.nbproposition++
                    this.isTimetoGo();
                    this.ngOnInit();
                  }
                  else {
                    // we pass to the next question (three input by sentence max) and increase the note
                    this.userChoices.push(this.missword3)
                    this.nbproposition++
                    this.note++
                    this.isTimetoGo();
                    this.ngOnInit();
                  }
                }
              }
            }
          }
        }
      }
    }

  }



  isTimetoGo(){
    if (this.nbproposition == nbQuestion) {
      this.navCtrl.push(ResultsPage, {
        note: this.note,
        course: this.selectedCourse,
        exGapsSentence: this.exGapsSentence,
        userChoices: this.userChoices,
        answers: this.answers,
        whoami: this.whoami
      });
    }
  }




}
export const nbQuestion = 5