import { Component} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'arabic-to-french',
    templateUrl: 'correction-arabic-to-french.html',
  
  })

  export class CorrectionArabicToFrenchPage {

    
    goodanswers: any[];
    userchoices:any[];
    

    constructor(public navCtrl: NavController, public navParams: NavParams) {

    
      // we retrive the selected course from the navigation parameters
      this.goodanswers = navParams.get('goodanswers');
      this.userchoices = navParams.get('userChoices');
      
    }
    showCorrection(){
      console.log("correctop")
    }
    

  }