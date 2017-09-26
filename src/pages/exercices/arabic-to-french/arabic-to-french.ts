import { Component} from '@angular/core';
//import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { WordsService } from '../../services/words.services'
import { NavController, NavParams } from 'ionic-angular';
import { ResultsPage } from '../results/results'
@Component({
    selector: 'arabic-to-french',
    templateUrl: 'arabic-to-french.html',
    providers: [WordsService]
  })

  export class ArabicToFrenchPage {

    selectedCourse: any;
    course_words: any[];
    displayed_words:any[];
    wordsearched:any;
    wordchoosen:any;
    note:number;
    nbproposition:number;
    maxWords:number;
    exWordsSearched:any[]
    userChoices:any[]

    constructor(public navCtrl: NavController, public navParams: NavParams,private wordsService:WordsService) {

    
      // we retrive the selected course from the navigation parameters
      this.selectedCourse = navParams.get('course');
      this.wordsearched={}
      this.note=0;
      this.nbproposition=0
      this.exWordsSearched = [];
      this.userChoices = [];
    }
    //getWords of a Course
    getWords(selectedCourse): void {
      let tmp_displayed_words:any[];
      let tmp_wordsearched:any;

      this.wordsService.getWords(selectedCourse).subscribe(words => {
        this.course_words = words;
        this.maxWords= words.length;
        /*
        we want to check if the future wordchoosen was chosen yet
        so we pass the five words and the wordchosen in temporary variables
        for check if not the screen would be refreshed with bad words
        */
        tmp_displayed_words=this.getFiveWords(this.maxWords);
        tmp_wordsearched=this.getSearchedWord(tmp_displayed_words)
        for(let i=0;i<this.exWordsSearched.length;i++){
        console.log("exwordsearched: " +this.exWordsSearched[i].french )
        }
        console.log("tmp_wordsearched: "+tmp_wordsearched.french)
        for(let i=0;i<this.exWordsSearched.length;i++){
          if((this.exWordsSearched[i].french==tmp_wordsearched.french) && (this.exWordsSearched[i].arabic==tmp_wordsearched.arabic)){
          tmp_displayed_words=this.getFiveWords(this.maxWords);
          tmp_wordsearched=this.getSearchedWord(tmp_displayed_words)

          i=-1;// because i++ comes after this line
          }
        
        //this.wordchoosen=''
        }
        this.displayed_words = tmp_displayed_words
        this.wordsearched= tmp_wordsearched
      });
  
    }
   


   ngOnInit(): void {
      this.getWords(this.selectedCourse);
      console.log("wodch "+this.wordchoosen)
      
    }
     getFiveWords(max):any[]{
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
       let tabwords:any[]=[];
       let tabnumbers:number[]=[]
       let nb:number;
       let maxIndex:number
       maxIndex=max - 1
       let nbmax=0;
       if (maxIndex>=5)
          nbmax=5
       else nbmax=maxIndex+1
       console.log(maxIndex)
      for(let i=0;i<nbmax;i++){
        
        nb = this.getRandomNumber(maxIndex,0)
        console.log(nb)
        if(tabnumbers.includes(nb)){
          i--;
        }
        else{
          tabnumbers.push(nb)
          tabwords[i]=this.course_words[nb]
        }
      }
      console.log(tabnumbers)
      return tabwords
     }
     
     getRandomNumber(max:number,min:number):number{
      let nb:number
      nb = Math.floor(Math.random() * max) + min;
      
      return nb;
     }
     
     getSearchedWord(tab:any[]):any{
      let nbr:number
      let wrd:any
      nbr=this.getRandomNumber(tab.length-1,0) // the tab index is 0 1 2 3 4
      wrd=tab[nbr];
      
      return tab[nbr];
     }

     validate(){
       this.exWordsSearched.push(this.wordsearched)
       if(this.wordchoosen==null){

       }

       else{
         this.userChoices.push(this.wordchoosen)
          console.log(this.wordchoosen)
          if(this.wordchoosen==this.wordsearched){
            console.log("OK")
            this.note++
          }
          else console.log("KO")
        this.nbproposition++
       if(this.nbproposition==4){
        this.navCtrl.push(ResultsPage, {
          note: this.note,
          course: this.selectedCourse,
          goodanswers: this.exWordsSearched,
          userschoice: this.userChoices
        });
        
        console.log("Finiiito!!!")
       }
       else this.ngOnInit()//this.getWords(this.selectedCourse);

        }
      }

      removeElementFromArray(wrd,array){
        let index=array.indexOf(wrd);
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