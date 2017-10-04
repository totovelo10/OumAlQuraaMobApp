import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Word } from '../../../interfaces/word';
import { WordIcon } from '../../../interfaces/word';
import { NativeAudio } from '@ionic-native/native-audio';
@Component({
  selector: 'correction-dictation-words',
  templateUrl: 'correction-dictation-words.html',

})

export class CorrectionDictationWordsPage {


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

  constructor(public navCtrl: NavController, public navParams: NavParams,private nativeAudio: NativeAudio) {


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

    /* console.log("wordSearchedClicked: "+ this.wordSearchedClicked);
     console.log("displayed words for this wordsearched: "+ this.displayedWordsChoosen);
     console.log("user choice for this wordsearched: "+ this.userChoiceAnswer);
     console.log("the good answer: "+ wordSearchedClicked.french);
    
     console.log(this.wordsSearched)
     console.log("les choix de l'utilisateur "+ this.userchoices )
     console.log("les mots affichés " + this.displayedWords)*/
     
  }
  playSound(word){
    for (let i = 0; i < this.soundWords.length; i++) {

      let course = this.selectedCourse.$key + "/"
      let sound = word.sound.replace(course, "")
      if (this.soundWords[i].includes(sound)) {

        this.nativeAudio.preloadSimple('uniqueId1', this.soundWords[i]).then(
          () => { console.log("success") },
          () => { console.log("Error") });
        this.nativeAudio.play('uniqueId1').then(
          () => { console.log("success") },
          () => { console.log("Error") });
      }
  
    }
  }

  backToMainCorrectPage() {
    this.answeropened = false;
  }

}