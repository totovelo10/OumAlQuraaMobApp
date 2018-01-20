import { Component, Inject,ViewChild } from '@angular/core';
import { ExoParentPage } from '../exo-parent';
import { WordsService } from '../../services/words.services'
import { NavController, NavParams, LoadingController,Content } from 'ionic-angular';
import { ResultsPage } from '../results/results';
import { Word } from '../../../interfaces/word';
import { File } from '@ionic-native/file';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage'
import { ToastController } from 'ionic-angular';
@Component({
  selector: 'image-to-arabic',
  templateUrl: 'image-to-arabic.html',
  providers: [WordsService]
})

export class ImageToArabicPage {
  @ViewChild(Content) content: Content;

  selectedCourse: any;
  course_words: any[];
  displayed_words: Word[];
  wordsearched: Word;
  wordchoosen: Word;
  note: number;
  nbproposition: number;
  maxWords: number;
  exWordsSearched: Word[]
  userChoices: Word[]
  exDisplayedWords: Array<Word[]>
  answers: string[]
  wordsearchedImageUrls: string[]
  wordsearchedImageUrl: string
  storageRef: any
  whoami: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private wordsService: WordsService,
    private file: File,
    private toastCtrl: ToastController,
    @Inject(FirebaseApp) firebaseApp: any) {


    // we retrive the selected course from the navigation parameters
    this.selectedCourse = navParams.get('course');
    this.course_words =navParams.get('course_words')
    this.wordsearched = { arabic: "", french: "", image: "", sound: "" }
    this.note = 0;
    this.nbproposition = 0
    this.exWordsSearched = [];// this tab has the words that were chosen before
    this.userChoices = [];
    this.exDisplayedWords = []
    this.wordsearchedImageUrls = []
    this.answers = []// this tab retrieve the state of the answer. If the answer is good the tab element is true else is false
    this.wordsearchedImageUrl = ""

    this.storageRef = firebaseApp.storage().ref()
    this.whoami = "imagetoarabic"
  }
  //getWords of a Course
  getWords(selectedCourse): void {
    let tmp_displayed_words: any[];
    let tmp_wordsearched: any;
    // we retrive word of the selected course
   // this.wordsService.getWords(selectedCourse).valueChanges().subscribe(words => {
      //this.course_words = words;
      this.maxWords = this.course_words.length;

      /*
      we want to check if the future wordchoosen was chosen yet
      then we pass the five words and the wordchosen in temporary variables
      for check because if we did not do thath the screen would be 
      refreshed with bad words
      */
      tmp_displayed_words = this.getFiveWords(this.maxWords);// here we choose five words of the selected course
      tmp_wordsearched = this.getSearchedWord(tmp_displayed_words)// here we chose a word between the five
      for (let i = 0; i < this.exWordsSearched.length; i++) {

        console.log("exwordsearched: " + this.exWordsSearched[i].french)

      }
      console.log("tmp_wordsearched: " + tmp_wordsearched.french)
      console.log("tmp_wordsearchedimg: " + tmp_wordsearched.image)
      //we check if worksearched has an image
      while (tmp_wordsearched.image==""){
        tmp_displayed_words = this.getFiveWords(this.maxWords);
        tmp_wordsearched = this.getSearchedWord(tmp_displayed_words)
        console.log("tmp_wordsearched: " + tmp_wordsearched.french)
        console.log("tmp_wordsearchedimg: " + tmp_wordsearched.image)
      }
      // we check if the wordsearched chosen is not in the exwordsearched  and we check if worksearched has an image
      for (let i = 0; i < this.exWordsSearched.length; i++) {
        if ((tmp_wordsearched.image=="")||((this.exWordsSearched[i].french == tmp_wordsearched.french) && 
        (this.exWordsSearched[i].arabic == tmp_wordsearched.arabic))) {
          
          tmp_displayed_words = this.getFiveWords(this.maxWords);
          tmp_wordsearched = this.getSearchedWord(tmp_displayed_words)

          i = -1;// because i++ comes after this line
        }
        
      }
      this.displayed_words = tmp_displayed_words
      this.wordsearched = tmp_wordsearched
      let course_fold = this.selectedCourse.id + "/" + "images"
      let reg = new RegExp('.*\/')
      let img = this.wordsearched.image.replace(reg, "")
      
      let filepath = this.file.externalDataDirectory + '/' + this.selectedCourse.id + '/' + img
      console.log(filepath)
      this.wordsearchedImageUrl = filepath

      /*let storageRefImage = this.storageRef.child(this.wordsearched.image);
   
      storageRefImage.getDownloadURL().then(url => this.wordsearchedImageUrl=url)*/

  //  });

  }



  ngOnInit(): void {
    this.content.scrollToTop();
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
    so we avoid the double
    */
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
      this.wordsearchedImageUrls.push(this.wordsearchedImageUrl)
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
          nbproposition: nbQuestion,
          course_words:this.course_words,
          wordsearchedImageUrls: this.wordsearchedImageUrls,
          whoami: this.whoami
        });


      }
      else {
        this.wordchoosen = null
        this.ngOnInit()//this.getWords(this.selectedCourse);
      }
    }
  }

  removeElementFromArray(wrd, array) {
    let index = array.indexOf(wrd);
    if (index > -1) {
      array.splice(index, 1);
    }
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
}
export const nbQuestion = 5