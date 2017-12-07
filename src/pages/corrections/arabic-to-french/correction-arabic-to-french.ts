import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Word } from '../../../interfaces/word';
import { WordIcon } from '../../../interfaces/word';
@Component({
  selector: 'correction-arabic-to-french',
  templateUrl: 'correction-arabic-to-french.html',

})

export class CorrectionArabicToFrenchPage {


  wordsSearched: any[];
  userchoices: any[];
  displayedWords: Array<Word[]>
  userChoiceAnswer: Word;
  displayedWordsChoosen: Word[]
  answeropened: boolean;
  wordSearchedClicked: any
  answericon: string[];
  wordsIcon: WordIcon[];
  selectedCourse:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {


    // we retrive the selected course from the navigation parameters
    this.selectedCourse = navParams.get('selectedCourse');
    this.wordsSearched = navParams.get('exWordsSearched');
    this.userchoices = navParams.get('userChoices');
    this.displayedWords = navParams.get('displayedWords')
    this.answericon = navParams.get('answers')
    this.answeropened = false;
    this.wordSearchedClicked = '';
    this.wordsIcon=[]
    

  }

  ngOnInit(): void {
    for(let i=0;i<this.wordsSearched.length;i++){
      let wi = {arabic:"",french:"",answericon:"",img:""};
      wi.arabic=this.wordsSearched[i].arabic
      wi.french=this.wordsSearched[i].french
      wi.answericon=this.answericon[i]
      this.wordsIcon.push(wi)
    }

  }
  showCorrection(wordSearchedClicked) {
    
    this.answeropened = true;
    for (let i = 0; i < this.wordsIcon.length; i++) {
      if (this.wordsIcon[i] == wordSearchedClicked) {
        this.wordSearchedClicked = wordSearchedClicked;
        this.userChoiceAnswer = this.userchoices[i].french;
        this.displayedWordsChoosen = this.displayedWords[i]

      }


    }

     console.log("wordSearchedClicked: "+ this.wordSearchedClicked);
     console.log("displayed words for this wordsearched: "+ this.displayedWordsChoosen);
     console.log("user choice for this wordsearched: "+ this.userChoiceAnswer);
     console.log("the good answer: "+ wordSearchedClicked.french);
    
     console.log(this.wordsSearched)
     console.log("les choix de l'utilisateur "+ this.userchoices )
     console.log("les mots affichés " + this.displayedWords)
     
  }


  backToMainCorrectPage() {
    this.answeropened = false;
  }

}