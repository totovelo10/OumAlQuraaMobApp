import { Component, ViewChild } from '@angular/core';
import { ResultsService } from '../services/results.services';
import { User } from '../../interfaces/user'
import { Result } from '../../interfaces/result'
import { Content } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
@Component({
  selector: 'progression',
  templateUrl: 'progression.html',
  providers: [ResultsService]
})
export class ProgressionPage {
  user: User
  result: Array<Result>
  barData:Array<Number>
  lineChart: any;
  doughnutChart : any;
  nbgaGeneral:number
  nbQuestionGeneral:number
  nbGeneral:number
  percentGeneral:number
  nbArabicToFrenchGeneral:number
  percentArabicToFrenchGeneral:number
  nbFrenchToArabicGeneral:number
  percentFrenchToArabicGeneral:number
  nbCorrectSentencesGeneral:number
  nbDictationGeneral:number
  nbImageGeneral:number
  percentImageGeneral:number
  nbAudioGeneral:number
  percentAudioGeneral:number
  nbpercentDictationGeneral:number
  percentDictationGeneral:number
  percentCorrectSentencesGeneral:number

  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild(Content) content: Content;

  constructor(private resultsServices: ResultsService,
    private storage: Storage) {
      this.user= {id:"",email:"",firstname:"",lastname:"",kunya:"",currentunit:""}
      this.barData=[]
      this.nbArabicToFrenchGeneral=0
      this.nbFrenchToArabicGeneral = 0
      this.nbAudioGeneral=0
      this.nbCorrectSentencesGeneral=0
      this.nbDictationGeneral=0
      this.nbImageGeneral =0
      this.nbQuestionGeneral= 0
      this.storage.get('user').then((user) => {
        if (user !== null) {
          this.user = user
          this.resultsServices.getResultByUserId(user.id).valueChanges().subscribe(
            result => {
              this.result = result
              console.log(result)
              
              this.result.forEach(element => {
                this.nbgaGeneral=this.nbgaGeneral + element.nbga
                this.nbQuestionGeneral = this.nbQuestionGeneral + element.nbQuestion
                
                if(element.exo == 'arabictofrench')
                this.nbArabicToFrenchGeneral = this.nbArabicToFrenchGeneral +element.nbga
    
                
                if(element.exo == 'frenchtoarabic')
                this.nbFrenchToArabicGeneral = this.nbFrenchToArabicGeneral +element.nbga
                console.log(this.nbFrenchToArabicGeneral)
                if(element.exo == 'imagetoarabic')
                this.nbImageGeneral = this.nbImageGeneral +element.nbga

                if(element.exo == 'soundwordstofrench')
                this.nbAudioGeneral = this.nbAudioGeneral +element.nbga

                if(element.exo == 'dictationwords')
                this.nbDictationGeneral = this.nbDictationGeneral +element.nbga

                if(element.exo == 'correctsentences')
                this.nbCorrectSentencesGeneral = this.nbCorrectSentencesGeneral +element.nbga

                if(element.exo == 'soundwordstofrench')
                this.nbAudioGeneral = this.nbAudioGeneral +element.nbga
                this.barData.push(element.nbga)
              });
              //
              this.percentArabicToFrenchGeneral =Math.round (this.nbArabicToFrenchGeneral/this.nbQuestionGeneral *100)
              this.percentFrenchToArabicGeneral =Math.round (this.nbFrenchToArabicGeneral/this.nbQuestionGeneral *100)
              this.percentImageGeneral = Math.round (this.nbImageGeneral/this.nbQuestionGeneral *100)
              this.percentDictationGeneral = Math.round (this.nbDictationGeneral/this.nbQuestionGeneral *100)
              this.percentCorrectSentencesGeneral = Math.round (this.nbCorrectSentencesGeneral/this.nbQuestionGeneral *100)
              this.percentAudioGeneral = Math.round (this.nbAudioGeneral/this.nbQuestionGeneral *100)
              console.log(this.nbArabicToFrenchGeneral)
              console.log(this.nbFrenchToArabicGeneral)
              console.log(this.nbDictationGeneral)
              console.log(this.nbImageGeneral)
              console.log( this.nbCorrectSentencesGeneral)
              console.log( this.nbAudioGeneral) 

              this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
                
                           type: 'pie',
                           data: {
                               labels: ["AR-FR", "FR-AR", "Image-AR", "Dictee", "Correction Phrases","Audio"],
                               datasets: [{
                                   label: '# of Exercices',
                                   data: [this.nbArabicToFrenchGeneral,
                                    this.nbFrenchToArabicGeneral, 
                                    this.nbImageGeneral, 
                                    this.nbDictationGeneral,
                                    this.nbCorrectSentencesGeneral,
                                    this.nbAudioGeneral],
                                   backgroundColor: [
                                       'rgba(255, 99, 132, 0.2)',
                                       'rgba(54, 162, 235, 0.2)',
                                       'rgba(255, 206, 86, 0.2)',
                                       'rgba(75, 192, 192, 0.2)',
                                       'rgba(153, 102, 255, 0.2)',
                                       'rgba(255, 159, 64, 0.2)'
                                   ],
                                   hoverBackgroundColor: [
                                       "#FF6384",
                                       "#36A2EB",
                                       "#FFCE56",
                                       "#FF6384",
                                       "#36A2EB",
                                       "#FFCE56"
                                   ]
                               }]
                           }
                
                       });
            }
          )
        }
      }
      )

  }
  //refresh the content size
  ionViewDidEnter(): void {

    this.content.resize()
   

  }

  ionViewDidLoad() {
    
  this.lineChart = new Chart(this.lineCanvas.nativeElement, {
    
               type: 'line',
               data: {
                   labels: ["January", "February", "March", "April", "May", "June", "July"],
                   datasets: [
                       {
                           label: "My First dataset",
                           fill: false,
                           lineTension: 0.1,
                           backgroundColor: "rgba(75,192,192,0.4)",
                           borderColor: "rgba(75,192,192,1)",
                           borderCapStyle: 'butt',
                           borderDash: [],
                           borderDashOffset: 0.0,
                           borderJoinStyle: 'miter',
                           pointBorderColor: "rgba(75,192,192,1)",
                           pointBackgroundColor: "#fff",
                           pointBorderWidth: 1,
                           pointHoverRadius: 5,
                           pointHoverBackgroundColor: "rgba(75,192,192,1)",
                           pointHoverBorderColor: "rgba(220,220,220,1)",
                           pointHoverBorderWidth: 2,
                           pointRadius: 1,
                           pointHitRadius: 10,
                           data: this.barData,
                           spanGaps: false,
                       }
                   ]
               }
    
           });



         
    
       }


}