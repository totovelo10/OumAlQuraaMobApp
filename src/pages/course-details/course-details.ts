import { Component, Inject } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Observable } from 'rxjs/Observable';
import { Word } from '../../interfaces/word';
import { File } from '@ionic-native/file';
import { WordsService } from '../services/words.services'
import { Media, MediaObject } from '@ionic-native/media';
import * as firebase from 'firebase';

@Component({
  selector: 'course-details',
  templateUrl: 'course-details.html',
  providers: [WordsService]
})
export class CourseDetailsPage {
  selectedItem: any;
  course_words: any[];
  course_words_tmp: AngularFireList<Word[]>
  soundWords: Array<any>;
  soundUrl = []
  imgUrl = []
  maxWords: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    db: AngularFireDatabase,
    private nativeAudio: NativeAudio,
    private file: File,
    public platform: Platform,
    private media: Media,
    private wordsService: WordsService) {
    // we pass the selected course as navigation parameter
    this.selectedItem = navParams.get('course');
    this.soundWords = [];
    let url = '/words/'
    let ref = firebase.database().ref
    console.log(this.selectedItem.id)
    // we select the words that have the course to true in the bdd
    db.list(url, ref => ref.orderByChild(this.selectedItem.id).equalTo(true)).valueChanges().subscribe(words => {
      console.log(words)
      this.course_words = words
      this.maxWords = words.length;

      this.file.createDir(this.file.externalDataDirectory, this.selectedItem.title, true).then((data) => {
        console.log(data)
      },
        (error) => { console.log(error) })

      //we retrive the sounds of all words
      for (let i = 0; i < this.course_words.length; i++) {
        //console.log((this.course_words[i].sound))
        let storageRefS = firebase.storage().ref().child(this.course_words[i].sound);
        // set all urls sound in a array
        storageRefS.getDownloadURL().then(url => this.createSoundFile(this.soundUrl.push(url), i))
        let storageRefI = firebase.storage().ref().child(this.course_words[i].image);
        // set all urls image in a array
        storageRefI.getDownloadURL().then(url => this.createImageFile(this.imgUrl.push(url), i))

      }
    })

    //we retrive the sounds of all words
    /*for (let i = 0; i < this.course_words.length; i++) {
      console.log((this.course_words[i].sound))
      let storageRefS = firebase.storage().ref().child(this.course_words[i].sound);
      // set all urls sound in a array
      storageRefS.getDownloadURL().then(url => this.createSoundFile(this.soundUrl.push(url), i))
      let storageRefI = firebase.storage().ref().child(this.course_words[i].image);
      // set all urls image in a array
      storageRefI.getDownloadURL().then(url => this.createImageFile(this.imgUrl.push(url), i))*/
  }








  play(word): void {
    for (let i = 0; i < this.course_words.length; i++) {

      let course = this.selectedItem.id + "/"
      let sound = word.sound.replace(course, "")
      if (this.course_words[i].sound.includes(sound)) {
        console.log(this.course_words[i])
        if (this.platform.ready()) {
          this.platform.ready().then(() => {
            let filepath = this.file.externalDataDirectory + '/' + this.selectedItem.title + '/' + sound
            let file: MediaObject = this.media.create(filepath)
            // fires when file status changes
            file.onStatusUpdate.subscribe((status) => {
              if (status == 4) {
                console.log("file release")
                file.release();
              }
            }
            );
            file.onError.subscribe(error => console.log('Error!', error));
            file.play();
            //file.pause()
            // get file duration
            let duration = file.getDuration();
            console.log("file duration: " + duration);



          }
          )
        }
      }
    }
  }

  createSoundFile(num: number, index: number) {
    console.log(this.course_words.length)
    console.log(this.soundUrl.length)
    let i = num - 1
    let url = this.soundUrl[num - 1]
    console.log(this.soundUrl[i])
    fetch(url)
      .then(res => res.blob())
      .then(res => {
        console.log(res)
        let course = this.selectedItem.id + "/"
        console.log(course)
        let filepath = this.file.externalDataDirectory + this.selectedItem.title
        console.log(filepath)
        let filename = this.course_words[index].sound.replace(course, "")
        console.log(filename)
        this.file.writeFile(filepath, filename, res)
      })
  }

  createImageFile(num: number, index: number) {
    console.log(this.course_words.length)
    console.log(this.imgUrl.length)
    let i = num - 1
    let url = this.imgUrl[num - 1]
    console.log(this.imgUrl[i])
    fetch(url)
      .then(res => res.blob())
      .then(res => {
        console.log(res)
        let course = this.selectedItem.id + "/" + 'images/'
        console.log(course)
        let filepath = this.file.externalDataDirectory + this.selectedItem.title
        console.log(filepath)
        let filename = this.course_words[index].image.replace(course, "")
        console.log(filename)
        this.file.writeFile(filepath, filename, res)
      })
  }
}
