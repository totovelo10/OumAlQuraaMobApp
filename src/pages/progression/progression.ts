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
    barData: Array<Number>
    linearDataArabicFrench: Array<any>
    linearDataFrenchArabic: Array<any>
    linearDataImageArabic: Array<any>
    linearDataSoundFrench: Array<any>
    linearDataDictation: Array<any>
    linearDataCorrectsentences: Array<any>
    lineChart: any;
    labelsArabicFrench :Array<any>
    labelsFrenchArabic :Array<any>
    labelsImageArabic :Array<any>
    labelsSoundFrench :Array<any>
    labelsDictation :Array<any>
    labelsCorrectsentences :Array<any>
    doughnutChart: any;
    frencharabicChart: any
    arabicfrenchChart: any
    imagearabicChart: any
    soundfrenchChart: any
    dictationChart: any
    correctsentencesChart: any
    nbgaGeneral: number
    nbQuestionGeneral: number
    nbGeneral: number
    percentGeneral: number
    nbArabicToFrenchGeneral: number
    percentArabicToFrenchGeneral: number
    nbFrenchToArabicGeneral: number
    percentFrenchToArabicGeneral: number
    nbCorrectSentencesGeneral: number
    nbDictationGeneral: number
    nbImageGeneral: number
    percentImageGeneral: number
    nbAudioGeneral: number
    percentAudioGeneral: number
    nbpercentDictationGeneral: number
    percentDictationGeneral: number
    percentCorrectSentencesGeneral: number

//@ViewChild('lineCanvas') lineCanvas;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('lineArabicFrench') lineArabicFrench;
    @ViewChild('lineFrenchArabic') lineFrenchArabic;
    @ViewChild('lineImageArabic') lineImageArabic;
    @ViewChild('lineSoundFrench') lineSoundFrench;
    @ViewChild('lineDictation') lineDictation;
    @ViewChild('lineCorrectsentences') lineCorrectsentences;
    @ViewChild(Content) content: Content;

    constructor(
        private resultsServices: ResultsService,
        private storage: Storage) {
        this.user = { id: "", email: "", firstname: "", lastname: "", kunya: "", currentunit: "" }
        this.barData = []
        this.linearDataArabicFrench = []
        this.linearDataFrenchArabic = []
        this.linearDataImageArabic= []
        this.linearDataSoundFrench= []
        this.linearDataDictation= []
        this.linearDataCorrectsentences= []
        this.labelsArabicFrench =[]
        this.labelsArabicFrench = []
        this.labelsFrenchArabic = []
        this.labelsImageArabic = []
        this.labelsSoundFrench = []
        this.labelsDictation = []
        this.labelsCorrectsentences = []
        this.nbArabicToFrenchGeneral = 0
        this.nbFrenchToArabicGeneral = 0
        this.nbAudioGeneral = 0
        this.nbCorrectSentencesGeneral = 0
        this.nbDictationGeneral = 0
        this.nbImageGeneral = 0
        this.nbQuestionGeneral = 0
        this.storage.get('user').then((user) => {
            if (user !== null) {
                this.user = user
                this.resultsServices.getResultByUserId(user.id).valueChanges().subscribe(
                    result => {
                        this.result = result
                        console.log(result)

                        this.result.forEach(element => {
                            let date = new Date(element.date)
                            let options = { month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"};
                            let datestr = date.toLocaleString("fr-FR",options).toString()
                            this.nbgaGeneral = this.nbgaGeneral + element.nbga
                            this.nbQuestionGeneral = this.nbQuestionGeneral + element.nbQuestion

                            if (element.exo == 'arabictofrench') {
                                
                                this.nbArabicToFrenchGeneral = this.nbArabicToFrenchGeneral + element.nbga
                                this.linearDataArabicFrench.push(element.nbga)  
                                this.labelsArabicFrench.push(datestr)
                                
                            }

                            if (element.exo == 'frenchtoarabic') {
                                this.nbFrenchToArabicGeneral = this.nbFrenchToArabicGeneral + element.nbga
                                this.linearDataFrenchArabic.push(element.nbga)   
                                this.labelsFrenchArabic.push(datestr)
                                
                            }

                            if (element.exo == 'imagetoarabic'){
                                this.nbImageGeneral = this.nbImageGeneral + element.nbga
                                this.linearDataImageArabic.push(element.nbga)   
                                this.labelsImageArabic.push(datestr)
                            }
                            if (element.exo == 'soundwordstofrench'){
                                this.nbAudioGeneral = this.nbAudioGeneral + element.nbga
                                this.linearDataSoundFrench.push(element.nbga)   
                                this.labelsSoundFrench.push(datestr)
                            }
                            if (element.exo == 'dictationwords'){
                                this.nbDictationGeneral = this.nbDictationGeneral + element.nbga
                                this.linearDataDictation.push(element.nbga)   
                                this.labelsDictation.push(datestr)
                            }
                            if (element.exo == 'correctsentences'){
                                this.nbCorrectSentencesGeneral = this.nbCorrectSentencesGeneral + element.nbga
                                this.linearDataCorrectsentences.push(element.nbga)   
                                this.labelsCorrectsentences.push(datestr)
                            }
                           

                           

                            console.log(this.linearDataArabicFrench)
                        });
                        //
                        console.log(this.linearDataArabicFrench) 
                        this.percentArabicToFrenchGeneral = Math.round(this.nbArabicToFrenchGeneral / this.nbQuestionGeneral * 100)
                        this.percentFrenchToArabicGeneral = Math.round(this.nbFrenchToArabicGeneral / this.nbQuestionGeneral * 100)
                        this.percentImageGeneral = Math.round(this.nbImageGeneral / this.nbQuestionGeneral * 100)
                        this.percentDictationGeneral = Math.round(this.nbDictationGeneral / this.nbQuestionGeneral * 100)
                        this.percentCorrectSentencesGeneral = Math.round(this.nbCorrectSentencesGeneral / this.nbQuestionGeneral * 100)
                        this.percentAudioGeneral = Math.round(this.nbAudioGeneral / this.nbQuestionGeneral * 100)
                        console.log(this.nbArabicToFrenchGeneral)
                        console.log(this.nbFrenchToArabicGeneral)
                        console.log(this.nbDictationGeneral)
                        console.log(this.nbImageGeneral)
                        console.log(this.nbCorrectSentencesGeneral)
                        console.log(this.nbAudioGeneral)
                        this.arabicfrenchChart = new Chart(this.lineArabicFrench.nativeElement,
                            {
                                type: 'line',
                                data:{
                                    labels: this.labelsArabicFrench,
                                    datasets: [
                                        {
                                            label: 'AR/FR',
                                            data: this.linearDataArabicFrench,
                                            backgroundColor:"#00cccc",
                                            borderColor:"#00cccc",
                                            pointBackgroundColor:"#00cccc",
                                            pointBorderColor:"#ffffff",
                                            pointHoverBackgroundColor:"#ff3300",
                                            pointHoverBorderColor:"#ffffff"

                                        }
                                    ]
                                } 
                            });
                           
                            this.frencharabicChart = new Chart(this.lineFrenchArabic.nativeElement,
                                {
                                    type: 'line',
                                    data:{
                                        labels: this.labelsFrenchArabic,
                                        datasets: [
                                            {
                                                label: 'FR/AR',
                                                data: this.linearDataFrenchArabic,
                                                backgroundColor:"#0000ff",
                                                borderColor:"#0000ff",
                                                pointBackgroundColor:"#0000ff",
                                                pointBorderColor:"#ffffff",
                                                pointHoverBackgroundColor:"#ff3300",
                                                pointHoverBorderColor:"#ffffff"
                                            }
                                        ]
                                    } 
                                });
                    
                                this.imagearabicChart = new Chart(this.lineImageArabic.nativeElement,
                                    {
                                        type: 'line',
                                        data:{
                                            labels: this.labelsImageArabic,
                                            datasets: [
                                                {
                                                    label: 'IMAGES/AR',
                                                    data: this.linearDataImageArabic,
                                                    backgroundColor:" #80dfff",
                                                    borderColor:" #80dfff",
                                                    pointBackgroundColor:" #80dfff",
                                                    pointBorderColor:"#ffffff",
                                                    pointHoverBackgroundColor:"#ff3300",
                                                    pointHoverBorderColor:"#ffffff"
                                                }
                                            ]
                                        } 
                                    });
                                    this.soundfrenchChart = new Chart(this.lineSoundFrench.nativeElement,
                                        {
                                            type: 'line',
                                            data:{
                                                labels: this.labelsSoundFrench,
                                                datasets: [
                                                    {
                                                        label: 'AUDIOS/FR',
                                                        data: this.linearDataSoundFrench,
                                                        backgroundColor:"#ff0000",
                                                        borderColor:"#ff0000",
                                                        pointBackgroundColor:"#ff0000",
                                                        pointBorderColor:"#ffffff",
                                                        pointHoverBackgroundColor:"#ffffff",
                                                        pointHoverBorderColor:"#ffffff"
                                                    }
                                                ]
                                            } 
                                        });
                                        this.dictationChart = new Chart(this.lineDictation.nativeElement,
                                            {
                                                type: 'line',
                                                data:{
                                                    labels: this.labelsDictation,
                                                    datasets: [
                                                        {
                                                            label: 'DICTEES',
                                                            data: this.linearDataDictation,
                                                            backgroundColor:"#ff6600",
                                                            borderColor:"#ff6600",
                                                            pointBackgroundColor:"#ff6600",
                                                            pointBorderColor:"#ffffff",
                                                            pointHoverBackgroundColor:"#ff3300",
                                                            pointHoverBorderColor:"#ffffff"
                                                        }
                                                    ]
                                                } 
                                            });
                        
                                            this.correctsentencesChart = new Chart(this.lineCorrectsentences.nativeElement,
                                                {
                                                    type: 'line',
                                                    data:{
                                                        labels: this.labelsCorrectsentences,
                                                        datasets: [
                                                            {
                                                                label: 'CORRECTIONS PHRASES',
                                                                data: this.linearDataCorrectsentences,
                                                                backgroundColor:"#00cccc",
                                                                borderColor:"#00cccc",
                                                                pointBackgroundColor:"#00cccc",
                                                                pointBorderColor:"#ffffff",
                                                                pointHoverBackgroundColor:"#ff3300",
                                                                pointHoverBorderColor:"#ffffff"
                                                            }
                                                        ]
                                                    } 
                                                });
                       /*
                        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

                            type: 'pie',
                            data: {
                                labels: ["AR-FR", "FR-AR", "Image-AR", "Dictee", "Correction Phrases", "Audio"],
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

                        });*/
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
    
       

       
                
            
        /*this.lineChart = new Chart(this.lineCanvas.nativeElement, {

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

        });*/





    }


}