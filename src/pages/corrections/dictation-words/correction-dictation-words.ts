import { Component } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import { Word } from '../../../interfaces/word';
import { WordIcon } from '../../../interfaces/word';
import { NativeAudio } from '@ionic-native/native-audio';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
@Component({
  selector: 'correction-dictation-words',
  templateUrl: 'correction-dictation-words.html',

})

export class CorrectionDictationWordsPage {

  course_words: any[];
  wordsSearched: any[];
  userchoices: any[];
  displayedWords: Array<Word[]>
  userChoiceAnswer: Word;
  displayedWordsChoosen: Word[]
  answeropened: boolean;
  wordSearchedClicked: any
  answericon: string[];
  wordsIcon: WordIcon[];
  soundWords: string[];
  selectedCourse:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private nativeAudio: NativeAudio,
    private file: File,
    public platform: Platform,
    private media: Media) {

    this.course_words = navParams.get('course_words')
    this.selectedCourse = navParams.get('selectedCourse');
    this.wordsSearched = navParams.get('exWordsSearched');
    this.userchoices = navParams.get('userChoices');
    this.displayedWords = navParams.get('displayedWords')
    this.answericon = navParams.get('answers')
    this.soundWords=navParams.get('soundWords')
    this.answeropened = false;
    this.wordSearchedClicked = '';
    this.wordsIcon=[]

  }

  ngOnInit(): void {
    for(let i=0;i<this.wordsSearched.length;i++){
      let wi = {arabic:"",french:"",sound:"",answericon:""};
      wi.arabic=this.wordsSearched[i].arabic
      wi.french=this.wordsSearched[i].french
      wi.sound=this.wordsSearched[i].sound
      wi.answericon=this.answericon[i]
      this.wordsIcon.push(wi)
    }

  }
  showCorrection(wordSearchedClicked) {
    
    this.answeropened = true;
    for (let i = 0; i < this.wordsIcon.length; i++) {
      if (this.wordsIcon[i] == wordSearchedClicked) {
        this.wordSearchedClicked = wordSearchedClicked;
        this.userChoiceAnswer = this.userchoices[i];
        //this.displayedWordsChoosen = this.displayedWords[i]

      }


    }

    
  }
  playSound(word) {
    for (let i = 0; i < this.course_words.length; i++) {
      console.log(this.course_words[i])
      let course = this.selectedCourse.id + "/"
      let sound = word.sound.replace(course, "")
      if (this.course_words[i].sound.includes(sound)) {
        this.platform.ready().then(() => {
          let filepath = this.file.externalDataDirectory + '/' + this.selectedCourse.title + '/' + sound
          let file: MediaObject = this.media.create(filepath)
          file.play()
        }
        )
      }
    }
  }

  backToMainCorrectPage() {
    this.answeropened = false;
  }

}