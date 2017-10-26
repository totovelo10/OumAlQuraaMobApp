import { Component } from '@angular/core';
import { WordsService } from '../../services/words.services'
import { GapsentencesService } from '../../services/gapsentences.services'
import { AlertController } from 'ionic-angular';
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
  course_gapsentences: Array<any>
  missingWords: Array<String>
  missword0: string
  missword1: string
  missword2: string
  missword3: string
  p0: string
  p1: string
  p2: string
  p3: string
  gaps_sentence: Gapsentence
  exGapsSentence: number[]
  propositionslist: Array<string>
  userChoices: Array<string>
  tata: any
  inputR:Array<any>

  constructor(public navCtrl: NavController, public navParams: NavParams, protected gapsentencesServices: GapsentencesService, public alertCtrl: AlertController) {
    // we retrive the selected course from the navigation parameters
    this.selectedCourse = navParams.get('course');
    this.gaps_sentence = { chapter: "", missword0: "", missword1: "", missword2: "", missword3: "", p0: "", p1: "", p2: "", p3: "", sentencegapsed: "", id: 0 }
    this.propositionslist = []
    this.note = 0;
    this.nbproposition = 0
    this.exGapsSentence = [];// this tab has the sentences that were chosen before
    this.answers = []// this tab retrieve the state of the answer. If the answer is good the tab element is true else is false
    //super(navCtrl,navParams,wordsService)
    this.whoami = "fillgaps"
    this.userChoices = [];
    this.inputR=[]
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
    //this.propositionslist=[]
    this.inputR=[]
    this.propositionslist=[]
    this.getGapsSetences(this.selectedCourse);
    

  }
  getGapsSetences(selectedCourse) {
    let tmp_gapsentence: Gapsentence;
    let max: number;
    this.gapsentencesServices.getGapSentences(selectedCourse).snapshotChanges().map(gapsentences => {
      this.course_gapsentences = gapsentences;
      max = this.course_gapsentences.length;
      console.log(gapsentences)

      let nb: number;
      nb = this.getRandomNumber(max)
      console.log("nb " + nb)
      tmp_gapsentence = this.course_gapsentences[nb]


      for (let i = 0; i < this.exGapsSentence.length; i++) {
        if (this.exGapsSentence[i] == tmp_gapsentence.id) {
          nb = this.getRandomNumber(max)
          tmp_gapsentence = this.course_gapsentences[nb]
          i = -1;// because i++ comes after this line
        }

      }
      this.gaps_sentence = tmp_gapsentence
      console.log(this.gaps_sentence)

      if (this.gaps_sentence.missword0 === undefined) {
        this.missword0 = undefined;
        this.p0 = undefined;
       }
      else {
        this.propositionslist.push(this.gaps_sentence.missword0)
        console.log('fdddf'+this.propositionslist)
       // this.missword0 = this.gaps_sentence.missword0;
       this.missword0 ="..... "
       this.p0 = this.gaps_sentence.p0;
       
      }
      if (this.gaps_sentence.missword1 === undefined) { 
        this.missword1 = undefined;
        this.p1 = undefined;
      }
      else {
        this.propositionslist.push(this.gaps_sentence.missword1)
        console.log('fdddf'+this.propositionslist)
        this.missword1 ="..... "
        this.p1 = this.gaps_sentence.p1;
      }
      if (this.gaps_sentence.missword2 === undefined) { 
        this.missword2 = undefined;
        this.p2 = undefined;
      }
      else {
        this.propositionslist.push(this.gaps_sentence.missword2)
        console.log('fdddf'+this.propositionslist)
        this.missword2 ="..... "
        this.p2 = this.gaps_sentence.p2;
      }

      if (this.gaps_sentence.missword3 === undefined) { 
        this.missword3 = undefined;
        this.p3 = undefined;
      }
      else {
        this.propositionslist.push(this.gaps_sentence.missword3)
        console.log('fdddf'+this.propositionslist)
        this.missword3 ="..... "
        this.p3 = this.gaps_sentence.p3;
      }

      for(let i =0; i<this.propositionslist.length;i++){
        let inp={type:"radio", label:this.propositionslist[i], value:this.propositionslist[i]}
        this.inputR.push(inp);
      }
      console.log(this.propositionslist)

    });

  }

  getRandomNumber(max: number): number {
    let nb: number
    nb = Math.floor(Math.random() * max);

    return nb;
  }
  validate(){
    this.exGapsSentence.push(this.gaps_sentence.id);
    this.ngOnInit();
  }
  // validate() {

  //   this.exGapsSentence.push(this.gaps_sentence.id);
  //   if (this.missword1 == null) {// if the first input is not informed no move

  //   }
  //   else { //if the first input is informed check if it is equal to this.gaps_sentence.missingword1
  //     if (this.gaps_sentence.missword1 != this.missword1) {// if not we can pass to the next sentence
  //       this.nbproposition++
  //       this.isTimetoGo();
  //       this.userChoices.push(this.missword1)
  //       this.ngOnInit();
  //     }
  //     else { // but if it equals we check if the sentence has a second input
  //       this.userChoices.push(this.missword1)//add user choice 
  //       if (this.gaps_sentence.missword2 === undefined) {// if it have not a second input 
  //         //we pass to the next question
  //         this.nbproposition++
  //         this.note++
  //         this.isTimetoGo();
  //         this.ngOnInit();
  //       }
  //       else { // if it have a second input 
  //         // we check if it is informed if not  no move
  //         if (this.missword2 == null) {
  //         }
  //         else {
  //           //if the second input is informed check if it equals to this.gaps_sentence.missingword2
  //           if (this.gaps_sentence.missword3 != this.missword2) { //if not we can pass to the next sentence
  //             this.userChoices.push(this.missword2)
  //             this.nbproposition++
  //             this.isTimetoGo();
  //             this.ngOnInit();
  //           }
  //           else { // but if it equals we check if the sentence has a third input
  //             this.userChoices.push(this.missword2)
  //             if (this.gaps_sentence.missword1 === undefined) {// if it have not a third input we pass to the next question
  //               this.nbproposition++
  //               this.note++
  //               this.isTimetoGo();
  //               this.ngOnInit();
  //             }
  //             else {// if it have a third input 
  //               // we check if it is informed if not  no move
  //               if (this.missword3 == null) {
  //               }
  //               else {
  //                 //if the third input is informed check if it equals to this.gaps_sentence.missingword3
  //                 if (this.gaps_sentence.missword0 != this.missword3) { //if not we can pass to the next sentence
  //                   this.userChoices.push(this.missword3)
  //                   this.nbproposition++
  //                   this.isTimetoGo();
  //                   this.ngOnInit();
  //                 }
  //                 else {
  //                   // we pass to the next question (three input by sentence max) and increase the note
  //                   this.userChoices.push(this.missword3)
  //                   this.nbproposition++
  //                   this.note++
  //                   this.isTimetoGo();
  //                   this.ngOnInit();
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  // }

  popup(mw): void {
    let prompt = this.alertCtrl.create({
      title: 'choisis le mot qui convient',
      message: 'Select option ',
      inputs: this.inputR,
      buttons: [
        {
          text: "Annuler",
          handler: data => {
            console.log("cancel clicked");
          }
        },
        {
          text: "OK",
          handler: data => {
            console.log(data)
            if(data===undefined) data="..... "
            switch (mw) {
              case 'missword0': this.missword0 = data; break;
              case 'missword1': this.missword1 = data; break;
              case 'missword2': this.missword2 = data; break;
              case 'missword3': this.missword3 = data; break;
            }

          }
        }]
    });
    prompt.present();
  }

  isTimetoGo() {
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