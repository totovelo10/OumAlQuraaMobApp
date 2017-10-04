import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CorrectionFrenchToArabicPage } from '../../../pages/corrections/french-to-arabic/correction-french-to-arabic';
import { CorrectionArabicToFrenchPage } from '../../../pages/corrections/arabic-to-french/correction-arabic-to-french';
import { CorrectionImageToArabicPage } from '../../../pages/corrections/image-to-arabic/correction-image-to-arabic';
import { CorrectionSoundWordsToFrenchPage } from '../../../pages/corrections/sound-words-to-french/correction-sound-words-to-french';
import { CorrectionDictationWordsPage } from '../../../pages/corrections/dictation-words/correction-dictation-words';
import { FrenchToArabicPage } from '../../../pages/exercices/french-to-arabic/french-to-arabic'
import { ArabicToFrenchPage } from '../../../pages/exercices/arabic-to-french/arabic-to-french'
import { ImageToArabicPage } from '../../../pages/exercices/image-to-arabic/image-to-arabic'
import { SoundWordsToFrenchPage } from '../../../pages/exercices/sound-words-to-french/sound-words-to-french';
import { DictationWordsPage } from '../../../pages/exercices/dictation-words/dictation-words';
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
  wordsearchedImageUrls: string[]
  whichPage: string;
  correctionPage: any;
  exoPage:any;
  soundWords: string[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.note = navParams.get('note');
    this.selectedCourse = navParams.get('course');
    this.exWordsSearched = navParams.get('exWordsSearched');
    this.userChoices = navParams.get('userChoices');
    this.displayedWords = navParams.get('displayedWords')
    this.answers = navParams.get('answers')
    this.wordsearchedImageUrls = navParams.get('wordsearchedImageUrls')
    this.soundWords=navParams.get('soundWords')
    this.whichPage = navParams.get('whoami')
    switch (this.whichPage) {
      case "frenchtoarabic": this.correctionPage = CorrectionFrenchToArabicPage;this.exoPage=FrenchToArabicPage; break;
      case "arabictofrench": this.correctionPage = CorrectionArabicToFrenchPage;this.exoPage=ArabicToFrenchPage; break;
      case "imagetoarabic": this.correctionPage = CorrectionImageToArabicPage;this.exoPage=ImageToArabicPage; break;
      case "soundwordstofrench": this.correctionPage = CorrectionSoundWordsToFrenchPage;this.exoPage=SoundWordsToFrenchPage; break;
      case "dictationwords": this.correctionPage = CorrectionDictationWordsPage;this.exoPage=DictationWordsPage; break;
    }
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


    this.navCtrl.push(this.correctionPage, {
      exWordsSearched: this.exWordsSearched,
      userChoices: this.userChoices,
      displayedWords: this.displayedWords,
      answers: this.answers,
      course: this.selectedCourse,
      wordsearchedImageUrls: this.wordsearchedImageUrls,
      soundWords:this.soundWords,
      selectedCourse:this.selectedCourse
    });

  }

  repeatExo() {
    this.navCtrl.push(this.exoPage, { course: this.selectedCourse })
  }
}
