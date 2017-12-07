import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { CorrectionFrenchToArabicPage } from '../../../pages/corrections/french-to-arabic/correction-french-to-arabic';
import { CorrectionArabicToFrenchPage } from '../../../pages/corrections/arabic-to-french/correction-arabic-to-french';
import { CorrectionImageToArabicPage } from '../../../pages/corrections/image-to-arabic/correction-image-to-arabic';
import { CorrectionSoundWordsToFrenchPage } from '../../../pages/corrections/sound-words-to-french/correction-sound-words-to-french';
import { CorrectionDictationWordsPage } from '../../../pages/corrections/dictation-words/correction-dictation-words';
import { CorrectionCorrectSentencesPage } from '../../../pages/corrections/correct-sentences/correction-correct-sentences';
import { FrenchToArabicPage } from '../../../pages/exercices/french-to-arabic/french-to-arabic'
import { ArabicToFrenchPage } from '../../../pages/exercices/arabic-to-french/arabic-to-french'
import { ImageToArabicPage } from '../../../pages/exercices/image-to-arabic/image-to-arabic'
import { SoundWordsToFrenchPage } from '../../../pages/exercices/sound-words-to-french/sound-words-to-french';
import { DictationWordsPage } from '../../../pages/exercices/dictation-words/dictation-words';
import { CorrectSentencesPage } from '../../../pages/exercices/correct-sentences/correct-sentences';
import { Word } from '../../../interfaces/word';
import { Sentence } from '../../../interfaces/sentence';
import { FalseSentence } from '../../../interfaces/falsentence';
import { nbQuestion } from '../../../constantes'
import { ExercicesCoursesPage } from '../../../pages/exercices/exercices-courses/exercices-courses';
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'results',
  templateUrl: 'results.html'
})
export class ResultsPage {
  course_words: any[];
  note: number;
  selectedCourse: any;
  appreciation: number;
  commentaire = { ar: "", fr: "" };
  exWordsSearched: any[];
  sentencesSearched: Sentence[]
  userChoices: any[];
  displayedWords: Array<Word[]>
  displayedSentences: Array<Sentence[]>
  falseDisplayed: Array<FalseSentence>
  answers: string[]
  wordsearchedImageUrls: string[]
  whichPage: string;
  correctionPage: any;
  exoPage: any;
  consigne: any
  soundWords: string[];
  dateExo: number
  urlResult:string
  resultId:any
  nbGa:number
  nbproposition:number
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private storage: Storage) {

    this.dateExo = Date.now()
    this.course_words = navParams.get('course_words')
    this.nbGa = navParams.get('note');
    this.selectedCourse = navParams.get('course');
    this.exWordsSearched = navParams.get('exWordsSearched');
    this.sentencesSearched = navParams.get('exSentencesSearched');
    this.userChoices = navParams.get('userChoices');
    this.displayedWords = navParams.get('displayedWords')
    this.displayedSentences = navParams.get('displayedSentences')
    this.falseDisplayed = navParams.get('falseDisplayed')
    this.answers = navParams.get('answers')
    this.wordsearchedImageUrls = navParams.get('wordsearchedImageUrls')
    this.soundWords = navParams.get('soundWords')
    this.consigne = navParams.get('consigne')
    this.whichPage = navParams.get('whoami')
    this.nbproposition = navParams.get('nbproposition')
    switch (this.whichPage) {
      case "frenchtoarabic": this.correctionPage = CorrectionFrenchToArabicPage; this.exoPage = FrenchToArabicPage; break;
      case "arabictofrench": this.correctionPage = CorrectionArabicToFrenchPage; this.exoPage = ArabicToFrenchPage; break;
      case "imagetoarabic": this.correctionPage = CorrectionImageToArabicPage; this.exoPage = ImageToArabicPage; break;
      case "soundwordstofrench": this.correctionPage = CorrectionSoundWordsToFrenchPage; this.exoPage = SoundWordsToFrenchPage; break;
      case "dictationwords": this.correctionPage = CorrectionDictationWordsPage; this.exoPage = DictationWordsPage; break;
      case "correctsentences": this.correctionPage = CorrectionCorrectSentencesPage; this.exoPage = CorrectSentencesPage; break;
    }
    this.note = (this.nbGa / nbQuestion) * 100
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
    //register the result in firebase
    storage.get('user').then((user) => {
      console.log(user);
      let resultId = firebase.database().ref('results').push({
        result: this.note,
        nbga:this.nbGa,
        userId: user.id,
        exo: this.whichPage,
        date: this.dateExo,
        nbQuestion:this.nbproposition,
        course:this.selectedCourse.id,
        id: ""
      })

      this.urlResult = 'results/'+resultId.key
      this.resultId = resultId.key;
      this.updateUserId()
    })

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.platform.registerBackButtonAction(() => {
        
        //this.navCtrl.popToRoot();
        this.navCtrl.setRoot(ExercicesCoursesPage, {course: this.selectedCourse})
      });
    });
  }

  backToExos(course: String) {

    //this.navCtrl.popToRoot();
    this.navCtrl.setRoot(ExercicesCoursesPage, {course: this.selectedCourse})
  }
  goToCorrection() {


    this.navCtrl.push(this.correctionPage, {
      course_words: this.course_words,
      exWordsSearched: this.exWordsSearched,
      sentencesSearched: this.sentencesSearched,
      userChoices: this.userChoices,
      displayedWords: this.displayedWords,
      displayedSentences: this.displayedSentences,
      answers: this.answers,
      course: this.selectedCourse,
      wordsearchedImageUrls: this.wordsearchedImageUrls,
      soundWords: this.soundWords,
      falseDisplayed: this.falseDisplayed,
      selectedCourse: this.selectedCourse,
      consigne: this.consigne
    });
    
  }

  repeatExo() {
    this.navCtrl.setRoot(this.exoPage, { course: this.selectedCourse })
    //this.navCtrl.push(this.exoPage, { course: this.selectedCourse })
  }

  updateUserId(){
    firebase.database().ref(this.urlResult).update({ id: this.resultId })
    .catch((error) =>{
        console.log(error)
    })
}
}
