/*
we choice a word or sentence in the list in french langage
the user click on record button 
after the user stop speak 
we check if the user record correspond with the word choice
*/

/*
for the beginning 
*/

import { ExoParentPage } from '../exo-parent';
import { WordsService } from '../../services/words.services'
import { SentencesService } from '../../services/sentences.services'
import { NavController, NavParams } from 'ionic-angular';
import { ResultsPage } from '../results/results';
import { Word } from '../../../interfaces/word';
import { Sentence } from '../../../interfaces/sentence';
import { Component,Inject, ViewChild } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
@Component({
    selector: 'recognize-sounds',
    templateUrl: 'recognize-sounds.html',
    providers: [WordsService, SentencesService]
})
export class RecognizeSoundsPage {

   
    goodansw: boolean
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
    whoami: string
    constructor(private speechRecognition: SpeechRecognition,
        public navCtrl: NavController,
        public navParams: NavParams,
        protected wordsService: WordsService,
        protected sentencesService: SentencesService,
        ) {
        // we retrive the selected course from the navigation parameters
        this.selectedCourse = navParams.get('course');
        this.course_words = navParams.get('course_words')
        //this.course_sentences = navParams.get('course_sentences')
        // we retrive word of the selected course
       // this.course_words = this.course_words.concat(this.course_sentences)
        console.log(this.course_words)
        this.wordsearched = {}
        this.note = 0;
        this.nbproposition = 0
        this.exWordsSearched = [];// this tab has the words that were chosen before
        this.userChoices = [];
        this.exDisplayedWords = []
        this.answers = []// this tab retrieve the state of the answer. If the answer is good the tab element is true else is false
        //super(navCtrl,navParams,wordsService)
        this.whoami = "frenchtoarabic"
        console.log("kdfdkf")
      //  this.wordchosen ="كتاب"
        this.goodansw =false
        this.speechRecognition.isRecognitionAvailable().then((available: boolean) => {
        console.log(available)
        
        }
    )

    }

change(){
    this.goodansw = false
}
    // Check feature available


    // Start the recognition 
    speak() {

this.speechRecognition.hasPermission()
.then((hasPermission: boolean) => {
    console.log(hasPermission)
   

}
)
let languages ="ar-SA"

        let options = {
            language:languages,
             matches:30,
            prompt:"parle",      // Android only
             showPopup:true,  // Android only
            showPartial:false 
          }

        this.speechRecognition.startListening(options).subscribe(
            (matches: Array<string>) => {
                console.log(matches)
                let i =0;
                matches.forEach(element =>{
                    
                    this.wordchoosen = element
                    if(element == this.wordsearched.arabic){
                        console.log("ok")
                        this.validate()
                        


                    }
                    else {
                        console.log("nok")
                        if(i== matches.length){
                            this.validate()
                        }
                        i++;
                    }
                    
                })
                
               
               
            },
            (onerror) => console.log('error:', onerror)
        )
    }


    ngOnInit(): void {
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
        so we avoid the double*/
    
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


      getWords(selectedCourse): void {
        let tmp_displayed_words: any[];
        let tmp_wordsearched: any;
        // we retrive word of the selected course
       // this.wordsService.getWords(selectedCourse).valueChanges().subscribe(words => {
         // this.course_words = words;
         // this.sentencesService.getSentences(selectedCourse).valueChanges().subscribe(sentences => {
          //  this.course_sentences = sentences
            //this.course_words = this.course_words.concat(this.course_sentences)
            //console.log(this.course_words)
    
            this.maxWords = this.course_words.length;
            /*.
            we want to check if the future wordchoosen was chosen yet
            then we pass the five words and the wordchosen in temporary variables
            for check because if we did not do that the screen would be 
            refreshed with bad words*/
    
            tmp_displayed_words = this.getFiveWords(this.maxWords);// here we choose five words of the selected course
            tmp_wordsearched = this.getSearchedWord(tmp_displayed_words)// here we chose a word between the five
            for (let i = 0; i < this.exWordsSearched.length; i++) {
              console.log("exwordsearched: " + this.exWordsSearched[i].french)
            }
            console.log("tmp_wordsearched: " + tmp_wordsearched.french)
            // we check if the wordsearched chosen is not in the exwordsearched 
            for (let i = 0; i < this.exWordsSearched.length; i++) {
              if ((this.exWordsSearched[i].french == tmp_wordsearched.french) && (this.exWordsSearched[i].arabic == tmp_wordsearched.arabic)) {
                tmp_displayed_words = this.getFiveWords(this.maxWords);
                tmp_wordsearched = this.getSearchedWord(tmp_displayed_words)
    
                i = -1;// because i++ comes after this line
              }
    
            }
            this.displayed_words = tmp_displayed_words
            this.wordsearched = tmp_wordsearched
          //})
    
          console.log(this.course_words)
       // });
    
      }
      validate() {
        
           console.log("valideeeeeeeeeeer")
        
            
              //this.exDisplayedWords.push(this.displayed_words);
              this.exWordsSearched.push(this.wordsearched)
              this.userChoices.push(this.wordchoosen)
              console.log(this.wordchoosen)
        
              if (this.wordchoosen == this.wordsearched.arabic) {
                this.note++
                this.answers.push("checkmark-circle-outline")
              }
              else {
                this.answers.push("flash")
              }
              this.nbproposition++
              if (this.nbproposition == 5) {
                this.navCtrl.push(ResultsPage, {
                  note: this.note,
                  course: this.selectedCourse,
                  exWordsSearched: this.exWordsSearched,
                  userChoices: this.userChoices,
                  answers: this.answers,
                  nbproposition: 5,
                  course_words:this.course_words,
                  course_sentences:this.course_sentences,
                  whoami: 'oral'
                });
        
                // console.log("Finiiito!!!")
              }
        
              else {
                this.wordchoosen = null
                this.ngOnInit()//this.getWords(this.selectedCourse);
              }
            }
          
    
}