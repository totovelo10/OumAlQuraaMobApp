import { Component, Inject } from '@angular/core';
import { WordsService } from '../../services/words.services'
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { ResultsPage } from '../results/results';
import { Word } from '../../../interfaces/word';
import { SentencesService } from '../../services/sentences.services'
import { FirebaseApp } from 'angularfire2';
import { NativeAudio } from '@ionic-native/native-audio';
import { File } from '@ionic-native/file';
import { Media, MediaObject } from '@ionic-native/media';
import * as firebase from 'firebase';
import { ToastController } from 'ionic-angular';
@Component({
  selector: 'sound-words-to-french',
  templateUrl: 'sound-words-to-french.html',
  providers: [WordsService,SentencesService],
})
export class SoundWordsToFrenchPage {


  selectedCourse: any;
  course_words: any[];
  course_sentences: any[];
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
  firebaseApp: any
  listened: boolean;
  soundUrl: any[]
  whoami: string

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private wordsService: WordsService,
    protected sentencesService: SentencesService,
    private nativeAudio: NativeAudio,
    private file: File,
    public platform: Platform,
    private toastCtrl: ToastController,
    private media: Media) {


    // we retrive the selected course from the navigation parameters
    this.selectedCourse = navParams.get('course');
    this.course_words = navParams.get('course_words')
    this.course_sentences = navParams.get('course_sentences')
    this.course_words = this.course_words.concat(this.course_sentences)
    this.wordsearched = {}
    this.note = 0;
    this.nbproposition = 0
    this.exWordsSearched = [];// this tab has the words that were chosen before
    this.userChoices = [];
    this.exDisplayedWords = []
    this.answers = []// this tab retrieve the state of the answer. If the answer is good the tab element is true else is false
   // this.firebaseApp = firebaseApp;
    this.listened = false;
    this.soundUrl = []
    this.whoami = 'soundwordstofrench'
    
  }


  //getWords of a Course
  getWords(selectedCourse): void {
    let tmp_displayed_words: any[];
    let tmp_wordsearched: any;
    // we retrive words of the selected course
    /*this.wordsService.getWords(selectedCourse).valueChanges().subscribe(words => {
      this.course_words = words;
      this.maxWords = words.length;
      this.sentencesService.getSentences(selectedCourse).valueChanges().subscribe(sentences => {
        this.course_sentences = sentences
        this.course_words = this.course_words.concat(this.course_sentences)
        console.log(this.course_words)*/

      /*we retrive the sounds of all words
      for (let i = 0; i < this.course_words.length; i++) {
        console.log((this.course_words[i].sound))
        let storageRef = firebase.storage().ref().child(this.course_words[i].sound);
        // set all urls sound in a array
        storageRef.getDownloadURL().then(url => this.createSoundFile(this.soundUrl.push(url),i))
      }*/


      //this.soundWords.push(url)
      /*
      we want to check if the future wordchoosen was chosen yet
      then we pass the five words and the wordchosen in temporary variables
      for check because if we did not do that the screen would be 
      refreshed with bad words
      */
      tmp_displayed_words = this.getFiveWords( this.course_words.length);// here we choose five words of the selected course
      tmp_wordsearched = this.getSearchedWord(tmp_displayed_words)// here we chose a word between the five
      for (let i = 0; i < this.exWordsSearched.length; i++) {
        console.log("exwordsearched: " + this.exWordsSearched[i].arabic)
      }
      console.log("tmp_wordsearched: " + tmp_wordsearched.arabic)
      // we check if the wordsearched chosen is not in the exwordsearched 
      for (let i = 0; i < this.exWordsSearched.length; i++) {
        if ((this.exWordsSearched[i].arabic == tmp_wordsearched.arabic) && (this.exWordsSearched[i].arabic == tmp_wordsearched.arabic)) {
          tmp_displayed_words = this.getFiveWords( this.course_words.length);
          tmp_wordsearched = this.getSearchedWord(tmp_displayed_words)

          i = -1;// because i++ comes after this line
        }


      }
      this.displayed_words = tmp_displayed_words
      this.wordsearched = tmp_wordsearched
   /* })
    });*/

  }



  ngOnInit(): void {
    this.getWords(this.selectedCourse);
    this.listened = false;
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
    so we avoid the double
    */
    let tabwords: any[] = [];
    let tabnumbers: number[] = []
    let nb: number;
    let maxIndex: number
    /* maxIndex = max - 1
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
      message: 'Choisissez une réponse parmi les propositions',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  validate() {
    
    if (this.wordchoosen == null) {
      this.presentToast()
    }

    else {
      this.exDisplayedWords.push(this.displayed_words);
      this.exWordsSearched.push(this.wordsearched)
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
          course_words:this.course_words,
          course_sentences:this.course_sentences,
          answers: this.answers,
          nbproposition:nbQuestion,
          whoami: this.whoami
        });

        console.log("Finiiito!!!")
      }
      else {
        this.wordchoosen = null
        this.ngOnInit()//this.getWords(this.selectedCourse);
      }
    }
  }

  playSound(word) {
    for (let i = 0; i < this.course_words.length; i++) {
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
        this.listened = true;
      }
    }
  }


  checkfiles():boolean{
    let checked:boolean
  //check if course directory exists
  // check if sounds courses files exists
  // if there do not , we build them with a load screen
    return checked
  }
  


  /*
  we passed the coursename 'selectedCourse' choosen as parameter-done
  we retrieve the words of the course 'course_words'-done
 // we retrieve the words of the previous courses
  we choose randomly five words => 'displayed_words'-done
  we choose randomly the word to find between the five => 'wordsearched'-done
  when the user validate
    we retrieve his choice =>'wordchoosen'-done
    if his choice equal the word to find then the 'note' increments-done
      
    else nothing
    we incremente the nbproposition -done
    if 'nbproposition' =X stop here and go to results - done
        if we want to go to correction
          we pass list arrays
          the first is an array with good answers= exwordschoosen
          the second is an array with displayed words
    else we refresh the screen

  */

  /*constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    protected wordsService: WordsService,
    public loading: LoadingController,
    @Inject(FirebaseApp) firebaseApp: any) {

    super(navCtrl, navParams, wordsService, loading,firebaseApp)
    this.whoami = "soundwordstofrench"

  }*/

}
export const nbQuestion = 5