import { Component,Inject,ViewChild } from '@angular/core';
import { NavController, NavParams, Platform,Content } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { WordsService } from '../../services/words.services'
import { Word } from '../../../interfaces/word';
import { ResultsPage } from '../results/results';
import { FirebaseApp } from 'angularfire2';
import { File } from '@ionic-native/file';
import { Media, MediaObject } from '@ionic-native/media';
import * as firebase from 'firebase';
import { ToastController } from 'ionic-angular';
@Component({
  selector: 'dictation-words',
  templateUrl: 'dictation-words.html',
  providers: [WordsService]
})

export class DictationWordsPage {
  @ViewChild(Content) content: Content;
  letters: any[]
  note: number;
  nbproposition:number
  dictee: string;
  selectedCourse: any;
  course_words: any[];
  course_sentences :any[]
  wordsearched: any;
  exWordsSearched: any[]
  answers: string[]
  soundWords: string[]
  firebaseApp:any
  listened:boolean;
  maxWords: number;
  displayed_words: Word[];
  userChoices: any[]
  constructor(public navCtrl: NavController, 
    private wordsService: WordsService,
    public navParams: NavParams, 
    private nativeAudio: NativeAudio,
    private file: File,
    public platform: Platform,
    private media: Media,
    private toastCtrl: ToastController) {

    this.letters = [
      { id: "19", arabic: "ا" },
      { id: "21", arabic: "ب" },
      { id: "18", arabic: "ت" },
      { id: "28", arabic: "ة" },
      { id: "10", arabic: "ث" },
      { id: "2", arabic: "ج" },
      { id: "3", arabic: "ح" },
      { id: "4", arabic: "خ" },
      { id: "1", arabic: "د" },
      { id: "0", arabic: "ذ" },
      { id: "31", arabic: "ر" },
      { id: "26", arabic: "ز" },
      { id: "23", arabic: "س" },
      { id: "24", arabic: "ش" },
      { id: "11", arabic: "ص" },
      { id: "12", arabic: "ض" },
      { id: "14", arabic: "ط" },
      { id: "25", arabic: "ظ" },
      { id: "6", arabic: "ع" },
      { id: "7", arabic: "غ" },
      { id: "8", arabic: "ف" },
      { id: "9", arabic: "ق" },
      { id: "15", arabic: "ك" },
      { id: "20", arabic: "ل" },
      { id: "16", arabic: "م" },
      { id: "17", arabic: "ن" },
      { id: "27", arabic: "و" },
      { id: "5", arabic: "ه" },
      { id: "22", arabic: "ي" },
      { id: "29", arabic: "ى" },
      { id: "45", arabic: "أ" },
      { id: "40", arabic: "إ" },
      { id: "51", arabic: "آ" },
      { id: "33", arabic: "ء" },
      { id: "32", arabic: "ؤ" },
      { id: "34", arabic: "ئ" },
      { id: "30", arabic: "لا" },
      { id: "57", arabic: " " },
      { id: "58", arabic: "<=" },
      { id: "35", arabic: "َ" },
      { id: "36", arabic: "ً" },
      { id: "37", arabic: "ُ" },
      { id: "38", arabic: "ٌ" },
      { id: "42", arabic: "ِ" },
      { id: "43", arabic: "ٍ" },
      { id: "49", arabic: "ْ" },
      { id: "53", arabic: "’" },
      { id: "54", arabic: "." },
      { id: "55", arabic: "؟" },
      { id: "56", arabic: "!" }
     
    ]

    this.dictee = "";
    this.selectedCourse = navParams.get('course');
    this.course_words = navParams.get('course_words')
    this.course_sentences = navParams.get('course_sentences')
    // we retrive word of the selected course
    this.course_words = this.course_words.concat(this.course_sentences)
    console.log(this.course_words)
    console.log(this.selectedCourse)
    this.wordsearched = {}
    this.exWordsSearched = [];// this tab has the words that were chosen before
    this.answers = []// this tab retrieve the state of the answer. If the answer is good the tab element is true else is false
    this.soundWords = [];
    
    this.listened=false;
    this.note = 0;
    this.nbproposition = 0
    this.userChoices = [];
    
  }

  
  ngOnInit(): void {
    this.content.scrollToTop();
    this.dictee = "";
    this.getWords(this.selectedCourse);
    this.listened=false;

  }

  addLetter(character: any) {
    if (character.arabic == "<=")
      this.dictee = this.dictee.slice(0, -1)
    else
      this.dictee = this.dictee + character.arabic;

  }

  //getWords of a Course
  getWords(selectedCourse): void {
    let tmp_displayed_words: any[];
    let tmp_wordsearched: any;
    // we retrive words of the selected course
   // this.wordsService.getWords(selectedCourse).valueChanges().subscribe(words => {
      
      this.maxWords = this.course_words.length;

      //we retrive the sounds of all words of the course
     // for(let i=0; i <this.course_words.length;i++){
//    let storageRef = firebase.storage().ref().child(this.course_words[i].sound);
        // set all urls sound in a array
     //   storageRef.getDownloadURL().then(url => this.soundWords.push(url))
        
     // }
      /*
      we want to check if the future wordchoosen was chosen yet
      then we pass the five words and the wordchosen in temporary variables
      for check because if we did not do that the screen would be 
      refreshed with bad words
      */
      tmp_displayed_words = this.getFiveWords(this.maxWords);// here we choose five words of the selected course
      tmp_wordsearched = this.getSearchedWord(tmp_displayed_words)// here we chose a word between the five
      for (let i = 0; i < this.exWordsSearched.length; i++) {
        console.log("exwordsearched: " + this.exWordsSearched[i].arabic)
      }
      console.log("tmp_wordsearched: " + tmp_wordsearched.arabic)
      // we check if the wordsearched chosen is not in the exwordsearched 
      for (let i = 0; i < this.exWordsSearched.length; i++) {
        if ((this.exWordsSearched[i].arabic == tmp_wordsearched.arabic) && (this.exWordsSearched[i].arabic == tmp_wordsearched.arabic)) {
          tmp_displayed_words = this.getFiveWords(this.maxWords);
          tmp_wordsearched = this.getSearchedWord(tmp_displayed_words)

          i = -1;// because i++ comes after this line
        }

      }
      this.displayed_words = tmp_displayed_words
      this.wordsearched = tmp_wordsearched
      
   // });

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
    so we avoid the double
    */
    let tabwords: any[] = [];
    let tabnumbers: number[] = []
    let nb: number;
    let maxIndex: number
    /*maxIndex = max - 1
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
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Vous n\'avez pas écrit de mots',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
  validate() {
    console.log('dictee:'+this.dictee)
    if (this.dictee == '') {
      this.presentToast()
    }

    else {
      //this.exDisplayedWords.push(this.displayed_words);
      this.exWordsSearched.push(this.wordsearched)
      this.userChoices.push(this.dictee)
      console.log(this.dictee)
      if (this.dictee == this.wordsearched.arabic) {
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
          course_words:this.course_words,
          course_sentences:this.course_sentences,
          answers: this.answers,
          soundWords:this.soundWords,
          nbproposition:nbQuestion,
          whoami: 'dictationwords'
        });

        console.log("Finiiito!!!")
      }
      else {
        this.dictee == null
        this.ngOnInit()//this.getWords(this.selectedCourse);
      }
    }
  }


  playSound(word){
    for (let i = 0; i < this.course_words.length; i++) {
      console.log(this.course_words[i])
      let sound=""
      let course = this.selectedCourse.id + "/"
      if(this.selectedCourse.revision==true){ 
        let reg = new RegExp('.*\/')
        sound = word.sound.replace(reg, "")
      console.log(sound)}
      else {sound = word.sound.replace(course, "")}
      if (this.course_words[i].sound.includes(sound)) {
        this.platform.ready().then(() => {
          let filepath = this.file.externalDataDirectory + '/' + this.selectedCourse.id+'/'+sound
          let file: MediaObject = this.media.create(filepath)
                 // fires when file status changes
                 file.onStatusUpdate.subscribe((status) => {
                  if (status == 4) {
                    console.log("file release")
                    file.release();
                  }
                }
                );
         file.play()
        })

      this.listened=true;
    }
  }




}

}
export const nbQuestion = 5