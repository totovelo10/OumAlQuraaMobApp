import { Component, Inject } from '@angular/core';
import { WordsService } from '../services/words.services'
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ResultsPage } from '../exercices/results/results';
import { Word } from '../../interfaces/word';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage'
import { ToastController } from 'ionic-angular';
@Component({
    selector: 'exo-parent',
    template: 'wait...',
    // providers: [WordsService]
})

export class ExoParentPage {
    firebaseApp: FirebaseApp
    nbQuestion: number
    selectedCourse: any;
    course_words: any[];
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
    wordsearchedImageUrls: string[]
    wordsearchedImageUrl: string
    storageRef: any
    whoami: string;
    eval: boolean
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        protected wordsService: WordsService,
        public loading: LoadingController,
        public toastCtrl: ToastController,
        @Inject(FirebaseApp) firebaseApp: any) {
        this.nbQuestion = 5
        this.eval = navParams.get('eval')
        // we retrive the selected course from the navigation parameters and the 
        this.selectedCourse = navParams.get('course');
        this.wordsearched = {}// the wordsearched
        this.note = 0;
        this.nbproposition = 0 // number of questions in the exo
        this.exWordsSearched = [];// this tab has the words that were chosen before
        this.userChoices = [];
        this.exDisplayedWords = [] // this tab has the words that were displayed in a specific question
        this.answers = []// this tab retrieve the state of the answer. If the answer is good the tab element is true else is false
        this.wordsearchedImageUrls = []
        this.wordsearchedImageUrl = ""
        this.storageRef = firebaseApp.storage().ref()
    }

    //getWords of a Course
    getWords(selectedCourse): void {
        let tmp_displayed_words: any[];
        let tmp_wordsearched: any;
        // we retrive word of the selected course
        this.wordsService.getWords(selectedCourse).valueChanges().subscribe(words => {
            this.course_words = words;
            this.maxWords = words.length;

            /*
            we want to check if the future wordchoosen was chosen yet
            then we pass the five words(five proposition in the question) and the wordchosen in temporary variables
            for check because if we did not do thath the screen would be 
            refreshed with bad words
            */
            tmp_displayed_words = this.getFiveWords(this.maxWords);// here we choose five words of the selected course
            tmp_wordsearched = this.getSearchedWord(tmp_displayed_words)// here we chose a word between the five
            for (let i = 0; i < this.exWordsSearched.length; i++) {
                // console.log("exwordsearched: " + this.exWordsSearched[i].french)
            }
            //console.log("tmp_wordsearched: " + tmp_wordsearched.french)
            // we check if the wordsearched chosen is not in the exwordsearched 
            // if tmp_wordsearched is equivalent to one of the exwordssearched we choose again the five proposition and the wordchoosen
            for (let i = 0; i < this.exWordsSearched.length; i++) {
                if ((this.exWordsSearched[i].french == tmp_wordsearched.french) && (this.exWordsSearched[i].arabic == tmp_wordsearched.arabic)) {
                    tmp_displayed_words = this.getFiveWords(this.maxWords);
                    tmp_wordsearched = this.getSearchedWord(tmp_displayed_words)

                    i = -1;// because i++ comes after this line so we return to 0 in order to we recompare the words
                }

            }
            // when we exit the loop we have our really proposition to display and the wordsearched
            this.displayed_words = tmp_displayed_words
            this.wordsearched = tmp_wordsearched
            let storageRefImage = this.storageRef.child(this.wordsearched.image);
            storageRefImage.getDownloadURL().then(url => this.wordsearchedImageUrl = url)
        });

    }



    ngOnInit(): void {
        this.getWords(this.selectedCourse);
        // this.ionViewLoaded()
        console.log("wodch " + this.wordchoosen)

    }

    /* ionViewLoaded() {
         let loader = this.loading.create({
             content: 'Getting latest entries...',
         });
 
         //loader.present().then(() => {
             this.getWords(this.selectedCourse);
          //   loader.dismiss();
        // });
 }*/
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
        //let maxIndex: number
        //maxIndex = max - 1
        //   let nbmax = 0;
        /*if (maxIndex >= 5)
          nbmax = 5
        else nbmax = maxIndex + 1
        console.log(maxIndex)*/
        //we want five words
        for (let i = 0; i < 5; i++) {
            //nb is a random number between 0 and max
            nb = this.getRandomNumber(max)
            //console.log(nb)
            //if tabnumbers has yet nb then we added the word which is corresponding to the number nb
            if (tabnumbers.includes(nb)) {
                i--;// the word did not added so we retry
            }
            else {
                tabnumbers.push(nb) // the number is added and we will cannot add it again
                tabwords[i] = this.course_words[nb] // the word corresponding to the nb is added and we will cannot add it again
            }
        }
        //console.log(tabnumbers)
        return tabwords
    }
    // choose randomly a number between 0  and max
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
            // if the user click validate without chose a word nothing is happening
            //TODO add a toast with message "choose a word"
            console.log(this.wordchoosen)
            this.presentToast()
        }

        else {

            // if the user click on a word and validate we add the wordchoosen in the userchoices array
            this.userChoices.push(this.wordchoosen)
            this.exDisplayedWords.push(this.displayed_words);// we add the displayed proposition in ex in order to know
            // when we correct the exo what propositions were proposed to the user
            this.exWordsSearched.push(this.wordsearched)// we add wordsearched in ex in order to don't have the same wordsearched
            // console.log(this.wordchoosen)
            this.wordsearchedImageUrls.push(this.wordsearchedImageUrl)
            if (this.wordchoosen == this.wordsearched) {
                this.note++// the note increase if the user make the goode choice
                this.answers.push("checkmark-circle-outline") // the userchoice will be displayed with the correct icon
            }
            else {
                this.answers.push("flash")// the userchoice will be displayed with the error icon
            }
            this.nbproposition++ // the number of the question increased
            if (this.nbproposition == this.nbQuestion) {

                // if we reach the  number of nbQuestion we exit
                // giving all these parameters to result page
                this.navCtrl.push(ResultsPage, {
                    note: this.note,
                    course: this.selectedCourse,
                    exWordsSearched: this.exWordsSearched,
                    userChoices: this.userChoices,
                    displayedWords: this.exDisplayedWords,
                    wordsearchedImageUrls: this.wordsearchedImageUrls,
                    answers: this.answers,
                    nbproposition: this.nbQuestion,
                    whoami: this.whoami
                });


            }
            else {
                this.wordchoosen = null
                this.ngOnInit() 
            }// while the number of the question did not reached nbQuestion
            //else this.ionViewLoaded()
            // we continue the exo

        }
    }

    removeElementFromArray(wrd, array) {
        let index = array.indexOf(wrd);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

}



