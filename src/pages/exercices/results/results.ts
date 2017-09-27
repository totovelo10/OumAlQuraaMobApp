import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CorrectionArabicToFrenchPage } from '../../../pages/corrections/arabic-to-french/correction-arabic-to-french';
import { Word } from '../../../interfaces/word';

@Component({
  selector: 'results',
  templateUrl: 'results.html'
})
export class ResultsPage {
  note:number;
  appreciation:number;
  commentaire={ar:"",fr:""};
  exWordsSearched:any[];
  userChoices:any[];
  displayedWords:Array<Word[]>
  answers:string[]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.note=navParams.get('note');
    this.exWordsSearched=navParams.get('exWordsSearched');
    this.userChoices=navParams.get('userChoices');
    this.displayedWords=navParams.get('displayedWords')
    this.answers= navParams.get('answers')
    this.note=(this.note/4)*100
    if(this.note>=0 && this.note<50){
      this.appreciation=1
      this.commentaire.ar='!اجتهد'
      this.commentaire.fr='Fait des efforts!'
    }
    if(this.note>=50 && this.note<=70){
      this.appreciation=2
      this.commentaire.ar='!جيد'
      this.commentaire.fr='Bien!'
    }
    if(this.note>70 && this.note<=85){
      this.appreciation=3
      this.commentaire.ar='!أحسنت'
      this.commentaire.fr='Très bon travail!'
    }

    if(this.note>85 && this.note<=100){
      this.appreciation=4
      this.commentaire.ar='!ممتاز'
      this.commentaire.fr='Excellent!'
    }
  }

  backToCourses(course: String){
    
    this.navCtrl.popToRoot();
  }
  goToCorrection(){
    this.navCtrl.push(CorrectionArabicToFrenchPage, {
      exWordsSearched: this.exWordsSearched,
      userChoices: this.userChoices,
      displayedWords:this.displayedWords,
      answers: this.answers
    });
  }
}
