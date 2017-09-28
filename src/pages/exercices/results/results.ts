import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CorrectionFrenchToArabicPage } from '../../../pages/corrections/french-to-arabic/correction-french-to-arabic';
import { CorrectionArabicToFrenchPage } from '../../../pages/corrections/arabic-to-french/correction-arabic-to-french';
import { FrenchToArabicPage } from '../../../pages/exercices/french-to-arabic/french-to-arabic'
import { ArabicToFrenchPage } from '../../../pages/exercices/arabic-to-french/arabic-to-french'
import { Word } from '../../../interfaces/word';

@Component({
  selector: 'results',
  templateUrl: 'results.html'
})
export class ResultsPage {
  note: number;
  selectedCourse: any;
  appreciation: number;
  commentaire = { ar: "", fr: "" };
  exWordsSearched: any[];
  userChoices: any[];
  displayedWords: Array<Word[]>
  answers: string[]
  whichPage: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.note = navParams.get('note');
    this.selectedCourse = navParams.get('course');
    this.exWordsSearched = navParams.get('exWordsSearched');
    this.userChoices = navParams.get('userChoices');
    this.displayedWords = navParams.get('displayedWords')
    this.answers = navParams.get('answers')
    this.whichPage = navParams.get('whoami')
    this.note = (this.note / 4) * 100
    if (this.note >= 0 && this.note < 50) {
      this.appreciation = 1
      this.commentaire.ar = '!اجتهد'
      this.commentaire.fr = 'Fait des efforts!'
    }
    if (this.note >= 50 && this.note <= 70) {
      this.appreciation = 2
      this.commentaire.ar = '!جيد'
      this.commentaire.fr = 'Bien!'
    }
    if (this.note > 70 && this.note <= 85) {
      this.appreciation = 3
      this.commentaire.ar = '!أحسنت'
      this.commentaire.fr = 'Très bon travail!'
    }

    if (this.note > 85 && this.note <= 100) {
      this.appreciation = 4
      this.commentaire.ar = '!ممتاز'
      this.commentaire.fr = 'Excellent!'
    }
  }

  backToExos(course: String) {

    this.navCtrl.popToRoot();
  }
  goToCorrection() {
    if (this.whichPage == 'frenchtoarabic') {

      this.navCtrl.push(CorrectionFrenchToArabicPage, {
        exWordsSearched: this.exWordsSearched,
        userChoices: this.userChoices,
        displayedWords: this.displayedWords,
        answers: this.answers,
        course: this.selectedCourse
      });
    }
    else {
      this.navCtrl.push(CorrectionArabicToFrenchPage, {
        exWordsSearched: this.exWordsSearched,
        userChoices: this.userChoices,
        displayedWords: this.displayedWords,
        answers: this.answers,
        course: this.selectedCourse
      });
    }
  }

  repeatetExo() {
    if (this.whichPage == 'frenchtoarabic') {
      this.navCtrl.push(FrenchToArabicPage, { course: this.selectedCourse });
    }
    else {
      this.navCtrl.push(ArabicToFrenchPage, { course: this.selectedCourse });
    }
  }
}
