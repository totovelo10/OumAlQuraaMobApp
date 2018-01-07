import { Component, Inject } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Word } from '../../interfaces/word';
import { SentencesService } from '../services/sentences.services'
import { File } from '@ionic-native/file';
import { WordsService } from '../services/words.services'
import { Media, MediaObject } from '@ionic-native/media';
import * as firebase from 'firebase';
import { ToastController } from 'ionic-angular';
@Component({
  selector: 'course-details',
  templateUrl: 'course-details.html',
  providers: [WordsService, SentencesService]
})
export class CourseDetailsPage {
  selectedItem: any;
  course_words: any[];
  course_sentences: any[];
  course_words_tmp: AngularFireList<Word[]>
  soundWords: Array<any>;
  soundUrl = []
  soundSentencesUrl = []
  imgUrl = []
  maxWords: number;
  connexion: any
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    db: AngularFireDatabase,
    private nativeAudio: NativeAudio,
    private file: File,
    public platform: Platform,
    private media: Media,
    private wordsService: WordsService,
    private storage: Storage,
    private toastCtrl: ToastController,
    protected sentencesService: SentencesService) {
    // we pass the selected course as navigation parameter
    this.selectedItem = navParams.get('course');
    //check the connexion with the base
    db.object(".info/connected").valueChanges().subscribe(connected => {
      console.log(connected);
      this.connexion = connected

      console.log("test connexion: " + this.connexion)
      if (this.connexion) {
        // we check if the dir exists
        this.file.checkDir(this.file.externalDataDirectory, this.selectedItem.id).then(value => {
          console.log("Directory " + this.selectedItem.id + " exists")
          // if the directory exists we remove it and recreate it because maybe the data changed
          this.file.removeRecursively(this.file.externalDataDirectory, this.selectedItem.id).then(value => {
            console.log("Directory " + this.selectedItem.id + " was removed")
            this.soundWords = [];
            let url = '/words/'
            let ref = firebase.database().ref
            console.log(this.selectedItem.id)
            // we select the words that have the course to true in the bdd
            db.list(url, ref => ref.orderByChild(this.selectedItem.id).equalTo(true)).valueChanges().subscribe(words => {

              console.log(words)
              this.course_words = words
              this.maxWords = words.length;
              // we store the words
              this.storage.set(this.selectedItem.id, this.course_words);

              this.file.createDir(this.file.externalDataDirectory, this.selectedItem.id, true).then((data) => {
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
                if (this.course_words[i].image != "") {
                  // set all urls image in a array
                  storageRefI.getDownloadURL().then(url => this.createImageFile(this.imgUrl.push(url), i))
                }
              }

            })
            this.sentencesService.getSentences(this.selectedItem).valueChanges().subscribe(sentences => {
              this.course_sentences = sentences
              //we store sentences
              let sentences_stored = this.selectedItem.id + "_sentence"
              this.storage.set(sentences_stored, this.course_sentences);
              this.file.createDir(this.file.externalDataDirectory, this.selectedItem.id, true).then((data) => {
                console.log(data)
              },
                (error) => { console.log(error) })

              //we retrive the sounds of all words
              for (let i = 0; i < this.course_sentences.length; i++) {


                //console.log((this.course_words[i].sound))
                let storageRefS = firebase.storage().ref().child(this.course_sentences[i].sound);
                // set all urls sound in a array
                storageRefS.getDownloadURL().then(url => this.createSoundFileSentences(this.soundSentencesUrl.push(url), i))

              }
            })
          })
            .catch(error => (console.log(error)))

        }
          // if the directory does not exist we create it and create the storage value
        ).catch(error => {

          console.log(error)

          this.soundWords = [];
          let url = '/words/'
          let ref = firebase.database().ref
          console.log(this.selectedItem.id)
          // we select the words that have the course to true in the bdd
          db.list(url, ref => ref.orderByChild(this.selectedItem.id).equalTo(true)).valueChanges().subscribe(words => {

            console.log(words)
            this.course_words = words
            this.maxWords = words.length;

            // we store the words
            this.storage.set(this.selectedItem.id, this.course_words);

            this.file.createDir(this.file.externalDataDirectory, this.selectedItem.id, true).then((data) => {
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
              if (this.course_words[i].image != "") {
                // set all urls image in a array
                storageRefI.getDownloadURL().then(url => this.createImageFile(this.imgUrl.push(url), i))
              }
            }

          })
          this.sentencesService.getSentences(this.selectedItem).valueChanges().subscribe(sentences => {
            this.course_sentences = sentences
            //we store sentences
            let sentences_stored = this.selectedItem.id + "_sentence"
            this.storage.set(sentences_stored, this.course_sentences);
            this.file.createDir(this.file.externalDataDirectory, this.selectedItem.id, true).then((data) => {
              console.log(data)
            },
              (error) => { console.log(error) })

            //we retrive the sounds of all words
            for (let i = 0; i < this.course_sentences.length; i++) {


              //console.log((this.course_words[i].sound))
              let storageRefS = firebase.storage().ref().child(this.course_sentences[i].sound);
              // set all urls sound in a array
              storageRefS.getDownloadURL().then(url => this.createSoundFileSentences(this.soundSentencesUrl.push(url), i))

            }
          })

        })
      }
      //else if the connexion is out retrieve the words from storage 
      else {
        console.log("the connexion is out")
        this.file.checkDir(this.file.externalDataDirectory, this.selectedItem.id).then(value => {
          console.log("Directory " + this.selectedItem.id + " exists")
          // if the directory exists we remove it and recreate it because maybe the data changed


          this.soundWords = [];
          let url = '/words/'
          let ref = firebase.database().ref
          console.log(this.selectedItem.id)
          console.log(typeof this.selectedItem.id)
          this.storage.keys().then(val => {
            console.log(val)
          })
          // we select the words that have the course to true in the bdd
          // db.list(url, ref => ref.orderByChild(this.selectedItem.id).equalTo(true)).valueChanges().subscribe(words => {
          // we retrieve the words from storage
          this.storage.get(this.selectedItem.id).then((words) => {
            if (words == null) {
              this.presentToast()
            }
            else {
              console.log(words)
              this.course_words = words
              this.maxWords = words.length;




              //we retrive the sounds of all words
              for (let i = 0; i < this.course_words.length; i++) {


                //console.log((this.course_words[i].sound))
                let storageRefS = firebase.storage().ref().child(this.course_words[i].sound);
                // set all urls sound in a array
                storageRefS.getDownloadURL().then(url => this.createSoundFile(this.soundUrl.push(url), i))
                let storageRefI = firebase.storage().ref().child(this.course_words[i].image);
                if (this.course_words[i].image != "") {
                  // set all urls image in a array
                  storageRefI.getDownloadURL().then(url => this.createImageFile(this.imgUrl.push(url), i))
                }
              }
            }
          })
          // we retrieve the words from storage
          let sentences_stored = this.selectedItem.id + "_sentence"
          this.storage.get(sentences_stored).then((sentences) => {
           
            console.log(sentences)
            this.course_sentences = sentences
            for (let i = 0; i < this.course_sentences.length; i++) {


              //console.log((this.course_words[i].sound))
              let storageRefS = firebase.storage().ref().child(this.course_sentences[i].sound);
              // set all urls sound in a array
              storageRefS.getDownloadURL().then(url => this.createSoundFileSentences(this.soundSentencesUrl.push(url), i))

            }
          })
        })
          .catch(error => {
            console.log(error)
            this.presentToast()
          }


          // if the directory does not exist we create it and create the storage value
          )
      }
    })


    /*this.soundWords = [];
    let url = '/words/'
    let ref = firebase.database().ref
    console.log(this.selectedItem.id)
    // we select the words that have the course to true in the bdd
    db.list(url, ref => ref.orderByChild(this.selectedItem.id).equalTo(true)).valueChanges().subscribe(words => {

      console.log(words)
      this.course_words = words
      this.maxWords = words.length;


      this.file.createDir(this.file.externalDataDirectory, this.selectedItem.id, true).then((data) => {
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
        if (this.course_words[i].image != "") {
          // set all urls image in a array
          storageRefI.getDownloadURL().then(url => this.createImageFile(this.imgUrl.push(url), i))
        }
      }

    })*/

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
    console.log(word)
    console.log(word.sound)
    console.log(this.course_words)
    for (let i = 0; i < this.course_words.length; i++) {

      let course = this.selectedItem.id + "/"
      let sound = word.sound.replace(course, "")
      if (this.course_words[i].sound.includes(sound)) {
        console.log(this.course_words[i])
        if (this.platform.ready()) {
          this.platform.ready().then(() => {
            let filepath = this.file.externalDataDirectory + '/' + this.selectedItem.id + '/' + sound
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
  playsentence(sentence): void {
    console.log(sentence)
    console.log(sentence.sound)
    console.log(this.course_sentences)
    for (let i = 0; i < this.course_sentences.length; i++) {

      let course = this.selectedItem.id + "/"
      let sound = sentence.sound.replace(course, "")
      if (this.course_sentences[i].sound.includes(sound)) {
        console.log(this.course_sentences[i])
        if (this.platform.ready()) {
          this.platform.ready().then(() => {
            let filepath = this.file.externalDataDirectory + '/' + this.selectedItem.id + '/' + sound
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


  createSoundFileSentences(num: number, index: number) {

    let i = num - 1
    let url = this.soundSentencesUrl[num - 1]
    console.log(this.soundSentencesUrl[i])
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(res => {
        console.log(res)
        let course = this.selectedItem.id + "/"
        console.log(course)
        let filepath = this.file.externalDataDirectory + this.selectedItem.id
        console.log(filepath)
        let filename = this.course_sentences[index].sound.replace(course, "")
        console.log(filename)

        this.file.writeFile(filepath, filename, res)
      })
  }

  createSoundFile(num: number, index: number) {
    console.log(this.course_words.length)
    console.log(this.soundUrl.length)
    let i = num - 1
    let url = this.soundUrl[num - 1]
    console.log(this.soundUrl[i])
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(res => {
        console.log(res)
        let course = this.selectedItem.id + "/"
        console.log(course)
        let filepath = this.file.externalDataDirectory + this.selectedItem.id
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
    console.log("imgggggggg" + this.imgUrl[i])
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(res => {
        console.log(res)
        let course = this.selectedItem.id + "/" + 'images/'
        console.log(course)
        let filepath = this.file.externalDataDirectory + this.selectedItem.id
        console.log(filepath)
        let filename = this.course_words[index].image.replace(course, "")
        console.log(filename)
        this.course_words[index].fileimg = filepath + '/' + filename
        console.log(this.course_words[index].fileimg)
        this.file.writeFile(filepath, filename, res)
      })
  }


  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'La connexion ne permet pas l\'affichage des données',
      duration: 7000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
