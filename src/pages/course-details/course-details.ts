import { Component, Inject } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { NavController,LoadingController,Loading, NavParams, Platform } from 'ionic-angular';
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
import {CoursesPage} from '../courses/courses';
@Component({
  selector: 'course-details',
  templateUrl: 'course-details.html',
  providers: [WordsService, SentencesService]
})
export class CourseDetailsPage {
  testcourse:any[]
  selectedItem: any;
  course_words: any[];
  course_gmwords :any[]
  course_sentences: any[];
  course_words_tmp: AngularFireList<Word[]>
  soundWords: Array<any>;
  soundUrl = []
  soundSentencesUrl = []
  imgUrl = []
  maxWords: number;
  connexion: any
  loading:any
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
    protected sentencesService: SentencesService,
    public loadingCtrl: LoadingController) {
      this.presentLoadingDefault()
    // we pass the selected course as navigation parameter
    this.selectedItem = navParams.get('course');
    //check the connexion with the base
    db.object(".info/connected").valueChanges().subscribe(connected => {
      console.log(connected);
      this.connexion = connected

      console.log("test connexion: " + this.connexion)
      if (this.connexion) {
        // if we are in an revision course we will delete all the presents directories
        // for free space
        if(this.selectedItem.revision==true){
          let url = '/courses/'
          let ref = firebase.database().ref
          db.list(url, ref => ref.orderByChild('rank').limitToFirst(this.selectedItem.rank)).valueChanges().subscribe(courses => {
            console.log(courses)
            this.testcourse =courses
            for(let j=0;j< courses.length -1;j++){
              this.file.checkDir(this.file.externalDataDirectory, this.testcourse[j].id).then(value => {
                this.file.removeRecursively(this.file.externalDataDirectory,  this.testcourse[j].id).then(value => {
                  console.log("Directory " + this.testcourse[j].id + " was removed")})
              })
            }
          })
        }
        //if it is not a revision course we delete all the revision course
        else{
          let url = '/courses/'
          let ref = firebase.database().ref
          db.list(url, ref => ref.orderByChild('revision').equalTo(true)).valueChanges().subscribe(courses => {
            console.log(courses)
            this.testcourse =courses
            for(let j=0;j< courses.length;j++){
              this.file.checkDir(this.file.externalDataDirectory, this.testcourse[j].id).then(value => {
                this.file.removeRecursively(this.file.externalDataDirectory,  this.testcourse[j].id).then(value => {
                  console.log("Directory " + this.testcourse[j].id + " was removed")})
              })
            }
          })
        }


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
                storageRefS.getDownloadURL().then(url => this.createSoundFile(this.soundUrl.push(url), i,this.course_words))
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

            this.wordsService.getGrammarWords(this.selectedItem).valueChanges().subscribe(grammarwords =>{
              console.log(grammarwords)
              this.course_gmwords = grammarwords
              // we store the words
              this.storage.set(this.selectedItem.id, this.course_gmwords);

              this.file.createDir(this.file.externalDataDirectory, this.selectedItem.id, true).then((data) => {
                console.log(data)
              },
                (error) => { console.log(error) })

              //we retrive the sounds of all words
              for (let i = 0; i < this.course_gmwords.length; i++) {


                //console.log((this.course_words[i].sound))
                let storageRefS = firebase.storage().ref().child(this.course_gmwords[i].sound);
                // set all urls sound in a array
                storageRefS.getDownloadURL().then(url => this.createSoundFile(this.soundUrl.push(url), i,this.course_gmwords))
                
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
              storageRefS.getDownloadURL().then(url => this.createSoundFile(this.soundUrl.push(url), i,this.course_words))
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
          this.wordsService.getGrammarWords(this.selectedItem).valueChanges().subscribe(grammarwords =>{
            console.log(grammarwords)
            this.course_gmwords = grammarwords
            // we store the words
            this.storage.set(this.selectedItem.id, this.course_gmwords);

            this.file.createDir(this.file.externalDataDirectory, this.selectedItem.id, true).then((data) => {
              console.log(data)
            },
              (error) => { console.log(error) })

            //we retrive the sounds of all words
            for (let i = 0; i < this.course_gmwords.length; i++) {


              //console.log((this.course_words[i].sound))
              let storageRefS = firebase.storage().ref().child(this.course_gmwords[i].sound);
              // set all urls sound in a array
              storageRefS.getDownloadURL().then(url => this.createSoundFile(this.soundUrl.push(url), i,this.course_gmwords))
              
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
                storageRefS.getDownloadURL().then(url => this.createSoundFile(this.soundUrl.push(url), i,this.course_words))
                let storageRefI = firebase.storage().ref().child(this.course_words[i].image);
                if (this.course_words[i].image != "") {
                  // set all urls image in a array
                  storageRefI.getDownloadURL().then(url => this.createImageFile(this.imgUrl.push(url), i))
                }
                else{
                  this.createImageFile(this.imgUrl.push(''), i)
        
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


    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.platform.registerBackButtonAction(() => {

        //this.navCtrl.popToRoot();
        this.navCtrl.setRoot(CoursesPage)
      });
    });


  }






  play(word,tab:any[]): void {
    console.log(word)
    
    console.log(word.sound)
    
   // let tab =this.course_words
   // if(tab==this.course_gmwords) tab=this.course_gmwords
    for (let i = 0; i < tab.length; i++) {
      let sound=""
      let course = this.selectedItem.id + "/"
      if(tab==this.course_gmwords) course=course+'gmw/'
      console.log(tab)
      if(this.selectedItem.revision==true){ 
        let reg = new RegExp('.*\/')
        if(tab==this.course_gmwords) reg = new RegExp('.*\/gmw\/')
        sound = word.sound.replace(reg, "")
      console.log(sound)}
      else {sound = word.sound.replace(course, "")}
      if (tab[i].sound.includes(sound)) {
        console.log(tab[i])
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

      let sound=""
      let course = this.selectedItem.id + "/"
      if(this.selectedItem.revision==true){ 
        let reg = new RegExp('.*\/')
        sound = sentence.sound.replace(reg, "")
      console.log(sound)}
      else {sound = sentence.sound.replace(course, "")}
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
        let filename=""
        if(this.selectedItem.revision==true){ 
          let reg = new RegExp('.*\/')
          filename = this.course_sentences[index].sound.replace(reg, "")
        console.log(filename)}
        else { filename = this.course_sentences[index].sound.replace(course, "")
        console.log(filename)
      }
        this.file.writeFile(filepath, filename, res)
      })
      
  }

  createSoundFile(num: number, index: number,tab:any[]) {
    //console.log(this.course_words.length)
    console.log(tab.length)
    console.log(this.soundUrl.length)
    let i = num - 1
    let url = this.soundUrl[num - 1]
    console.log(this.soundUrl[i])
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(res => {
        console.log(res)
        let course = this.selectedItem.id + "/"
        if(tab==this.course_gmwords) course=course+'gmw/'
        console.log(course)
        let filepath = this.file.externalDataDirectory + this.selectedItem.id
       // if(tab==this.course_gmwords) 
        console.log(filepath)
        let filename=""
        
        if(this.selectedItem.revision==true){ 
          let reg = new RegExp('.*\/')
          if(tab==this.course_gmwords) reg = new RegExp('.*\/gmw\/')
         // filename = this.course_words[index].sound.replace(reg, "")
         filename = tab[index].sound.replace(reg, "")
        console.log(filename)}
       // else { filename = this.course_words[index].sound.replace(course, "")
       else { filename = tab[index].sound.replace(course, "")
        console.log(filename)
      }

        this.file.writeFile(filepath, filename, res)
      })
      if((index+1)==this.course_words.length)
      this.dismissLoadingDefault();
  }

  createSoundFileGmw(num: number, index: number) {
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
        let filename=""
        
        if(this.selectedItem.revision==true){ 
          let reg = new RegExp('.*\/')
          filename = this.course_words[index].sound.replace(reg, "")
        console.log(filename)}
        else { filename = this.course_words[index].sound.replace(course, "")
        console.log(filename)
      }

        this.file.writeFile(filepath, filename, res)
      })
  }



  createImageFile(num: number, index: number) {
    console.log(this.course_words.length)
    console.log(this.imgUrl.length)
    let i = num - 1
    let url = this.imgUrl[num - 1]
    //console.log("imgggggggg" + this.imgUrl[i])
    if(url!=''){}
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(res => {
        console.log(res)
        let course = this.selectedItem.id + "/" + 'images/'
        console.log(course)
        let filepath = this.file.externalDataDirectory + this.selectedItem.id
        console.log(filepath)
        let filename=""
        if(this.selectedItem.revision==true){ 
          let reg = new RegExp('.*\/')
          filename = this.course_words[index].image.replace(reg, "")
        console.log(filename)}
       else{ filename = this.course_words[index].image.replace(course, "")
        console.log(filename)}
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

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
       content: 'Chargement en cours...'
     });
   
     this.loading.present();
     
     setTimeout(() => {
       this.loading.dismiss();
       console.log("too long!")
     }, 30000);
   }
 
   dismissLoadingDefault() {
    
      this.loading.dismiss({
        //content:"connexion out"
      });
      
     /* setTimeout(() => {
        loading.dismiss();
      }, 10000);*/
    }
}
