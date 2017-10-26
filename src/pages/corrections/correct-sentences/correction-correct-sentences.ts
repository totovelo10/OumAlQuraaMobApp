import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Sentence } from '../../../interfaces/Sentence';
import { FalseSentence } from '../../../interfaces/Falsentence';
import { SentenceIcon } from '../../../interfaces/Sentence';
@Component({
  selector: 'correction-correct-sentences',
  templateUrl: 'correction-correct-sentences.html',

})

export class CorrectionCorrectSentencesPage {


  sentencesSearched: any[];
  sentenceSearched:Sentence
  userchoices: any[];
  displayedSentences: Array<Sentence[]>
  falseDisplayed:Array<FalseSentence>
  userChoiceAnswer: Sentence;
  displayedSentencesChoosen: Sentence[]
  answeropened: boolean;
  sentenceSearchedClicked: any
  answericon: string[];
  sentencesIcon: SentenceIcon[];
  selectedCourse:any;
  consigne:any
  constructor(public navCtrl: NavController, public navParams: NavParams) {


    // we retrive the selected course from the navigation parameters
    this.selectedCourse = navParams.get('selectedCourse');
    this.sentencesSearched = navParams.get('sentencesSearched');
    this.userchoices = navParams.get('userChoices');
    this.displayedSentences = navParams.get('displayedSentences')
    this.falseDisplayed = navParams.get('falseDisplayed')
    this.answericon = navParams.get('answers')
    this.consigne= navParams.get('consigne')
    this.answeropened = false;
    this.sentenceSearchedClicked = '';
    this.sentencesIcon=[]
    

  }

  ngOnInit(): void {
    for(let i=0;i<this.falseDisplayed.length;i++){
      let wi = {arabic:"",french:"",answericon:""};
      wi.arabic=this.falseDisplayed[i].arabic
      //wi.french=this.sentencesSearched[i].french
      wi.answericon=this.answericon[i]
      this.sentencesIcon.push(wi)
    }

  }
  showCorrection(sentenceSearchedClicked) {
    
    this.answeropened = true;
    for (let i = 0; i < this.sentencesIcon.length; i++) {
      if (this.sentencesIcon[i] == sentenceSearchedClicked) {
        this.sentenceSearchedClicked = sentenceSearchedClicked;
        this.userChoiceAnswer = this.userchoices[i].arabic;
        this.displayedSentencesChoosen = this.displayedSentences[i]
        this.sentenceSearched = this.sentencesSearched[i].arabic

      }


    }

     console.log("sentenceSearchedClicked: "+ this.sentenceSearchedClicked);
     console.log("displayed sentences for this sentencesearched: "+ this.displayedSentencesChoosen);
     console.log("user choice for this sentencesearched: "+ this.userChoiceAnswer);
     console.log("the good answer: "+ sentenceSearchedClicked.french);
    
     console.log(this.sentencesSearched)
     console.log("les choix de l'utilisateur "+ this.userchoices )
     console.log("les mots affichés " + this.displayedSentences)
     
  }


  backToMainCorrectPage() {
    this.answeropened = false;
  }

}