import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Word } from '../../../interfaces/word';
import { WordIcon } from '../../../interfaces/word';
@Component({
  selector: 'correction-image-to-arabic',
  templateUrl: 'correction-image-to-arabic.html',

})

export class CorrectionImageToArabicPage {


  wordsSearched: any[];
  userchoices: any[];
  displayedWords: Array<Word[]>
  userChoiceAnswer: Word;
  displayedWordsChoosen: Word[]
  answeropened: boolean;
  wordSearchedClicked: any
  answericon: string[];
  wordsIcon: WordIcon[];
  wordsearchedImageUrls:string[]
  wordsearchedImageUrl:string
  constructor(public navCtrl: NavController, public navParams: NavParams) {


    // we retrive the selected course from the navigation parameters
    this.wordsSearched = navParams.get('exWordsSearched');
    this.userchoices = navParams.get('userChoices');
    this.displayedWords = navParams.get('displayedWords')
    this.answericon = navParams.get('answers')
    this.wordsearchedImageUrls = navParams.get('wordsearchedImageUrls')
    this.answeropened = false;
    this.wordSearchedClicked = '';
    this.wordsIcon=[]
    

  }

  ngOnInit(): void {
    for(let i=0;i<this.wordsSearched.length;i++){
      let wi = {arabic:"",french:"",answericon:""};
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
        this.userChoiceAnswer = this.userchoices[i].arabic;
        this.displayedWordsChoosen = this.displayedWords[i]
        this.wordsearchedImageUrl=this.wordsearchedImageUrls[i]
      }


    }

     console.log("wordSearchedClicked: "+ this.wordSearchedClicked);
     console.log("displayed words for this wordsearched: "+ this.displayedWordsChoosen);
     console.log("user choice for this wordsearched: "+ this.userChoiceAnswer);
     console.log("the good answer: "+ wordSearchedClicked.arabic);
    
     console.log(this.wordsSearched)
     console.log("les choix de l'utilisateur "+ this.userchoices )
     console.log("les mots affichés " + this.displayedWords)
     
  }


  backToMainCorrectPage() {
    this.answeropened = false;
  }

}