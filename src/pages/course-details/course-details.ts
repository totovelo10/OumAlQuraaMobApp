import { Component,Inject } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { NavController, NavParams } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import 'firebase/storage'

@Component({
  selector: 'course-details',
  templateUrl: 'course-details.html'
})
export class CourseDetailsPage {
  selectedItem: any;
  course_words: FirebaseListObservable<any[]>;
  soundWords:Array<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams,db: AngularFireDatabase,@Inject(FirebaseApp) firebaseApp: any,private nativeAudio: NativeAudio) {
    // we pass the selected course as navigation parameter
    this.selectedItem = navParams.get('course');
    
    let url='/words/'
    // we select the words that have the course to true in the bdd
    this.course_words = db.list(url,{
      query:{
        orderByChild: this.selectedItem.$key,
        equalTo:true
      }
    })
    //this.soundWords=["1"];
     // set all urls sound in a array
    this.course_words.subscribe((words)=>{
      this.soundWords=[];
      words.forEach(element => {
       let storageRef = firebaseApp.storage().ref().child(element.sound);
        storageRef.getDownloadURL().then(url =>this.soundWords.push(url))
        
      });
    })
    
  
  }

  play(word):void{
    for(let i=0;i<this.soundWords.length;i++){
      let course=this.selectedItem.$key+"/"
      let sound = word.sound.replace(course,"")
      console.log(sound)
      if(this.soundWords[i].includes(sound)){
        
        this.nativeAudio.preloadSimple('uniqueId1', this.soundWords[i]).then(
          ()=>{console.log("success")}, 
          ()=>{console.log("Error")});
        this.nativeAudio.play('uniqueId1').then(
          ()=>{console.log("success")}, 
          ()=>{console.log("Error")});
      }
        
    } 
  }
}
