import { Component, ViewChild } from '@angular/core';
import { ExoParentPage } from '../exo-parent';
import { ArabicToFrenchPage } from '../arabic-to-french/arabic-to-french';
import { ImageToArabicPage } from '../image-to-arabic/image-to-arabic';
import { FrenchToArabicPage } from '../french-to-arabic/french-to-arabic';
import { NavController, LoadingController, Loading,NavParams, Content, Platform } from 'ionic-angular';
import { WordsService } from '../../services/words.services'
import { SentencesService } from '../../services/sentences.services'
import { SoundWordsToFrenchPage } from '../sound-words-to-french/sound-words-to-french';
import { DictationWordsPage } from '../dictation-words/dictation-words';
import { RecognizeSoundsPage } from '../recognize-sounds/recognize-sounds';
import { CorrectSentencesPage } from '../correct-sentences/correct-sentences';
import { ExercicesPage } from '../exercices'
import { AngularFireDatabase } from 'angularfire2/database';
import { File } from '@ionic-native/file';
import * as firebase from 'firebase';
import { Label } from 'ionic-angular/components/label/label';
@Component({
  selector: 'exercices-courses',
  templateUrl: 'exercices-courses.html',
  providers: [WordsService, SentencesService]
})

export class ExercicesCoursesPage {
  @ViewChild(Content) content: Content;
  exercices: Array<{ title: string, component: any }>;
  selectedCourse: any;
  testcourse: any[]
  maxWords: number;
  // hideback: boolean
  course_words: any[];
  course_sentences: any[];
  soundUrl: any[]
  soundSentencesUrl = []
  imgUrl: any[]
  loading:any
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private file: File,
    private db: AngularFireDatabase,
    private wordsService: WordsService,
    public platform: Platform,
    protected sentencesService: SentencesService,
    public loadingCtrl: LoadingController,
  ) {
    if(this.navCtrl.last().name=="ExercicesPage")
    this.presentLoadingDefault()
    this.soundUrl = []
    this.imgUrl = []
    // we retrive the selected course from the navigation parameters
    this.selectedCourse = navParams.get('course');
    
    //this.hideback = navParams.get('hideback')
    console.log(this.navCtrl.last().name)
    
    // set our app's pages
    this.exercices = [
      { title: 'Du français à l\'arabe', component: FrenchToArabicPage },
      { title: 'De l\'arabe au français', component: ArabicToFrenchPage },
      { title: 'Images', component: ImageToArabicPage },
      { title: 'Audios', component: SoundWordsToFrenchPage },
      { title: 'Dictée', component: DictationWordsPage },
      //  { title: 'Reconaissance vocale', component: RecognizeSoundsPage }
      //{ title: 'Corriger les phrases', component: CorrectSentencesPage }

    ];

    // if we are in an revision course we will delete all the presents directories
    // for free space
    if (this.selectedCourse.revision == true) {
      let url = '/courses/'
      let ref = firebase.database().ref
      db.list(url, ref => ref.orderByChild('rank').limitToFirst(this.selectedCourse.rank)).valueChanges().subscribe(courses => {
        console.log(courses)
        this.testcourse = courses
        for (let j = 0; j < courses.length - 1; j++) {
          this.file.checkDir(this.file.externalDataDirectory, this.testcourse[j].id).then(value => {
            this.file.removeRecursively(this.file.externalDataDirectory, this.testcourse[j].id).then(value => {
              console.log("Directory " + this.testcourse[j].id + " was removed")
            })
          })
        }
      })
    }
    //if it is not a revision course we delete all the revision course
    else {
      let url = '/courses/'
      let ref = firebase.database().ref
      db.list(url, ref => ref.orderByChild('revision').equalTo(true)).valueChanges().subscribe(courses => {
        console.log(courses)
        this.testcourse = courses
        for (let j = 0; j < courses.length; j++) {
          this.file.checkDir(this.file.externalDataDirectory, this.testcourse[j].id).then(value => {
            this.file.removeRecursively(this.file.externalDataDirectory, this.testcourse[j].id).then(value => {
              console.log("Directory " + this.testcourse[j].id + " was removed")
            })
          })
        }
      })
    }
    
    // we retrive words of the selected course
    this.wordsService.getWords(this.selectedCourse).valueChanges().subscribe(words => {
      //this.presentLoadingDefault()
      this.course_words = words;
      this.maxWords = words.length;

      this.file.createDir(this.file.externalDataDirectory, this.selectedCourse.id, true).then((data) => {
        console.log(data)
      },
        (error) => { console.log(error) })

      //we retrive the sounds of all words
      for (let i = 0; i < this.course_words.length; i++) {
        console.log((this.course_words[i].sound))
        let storageRefS = firebase.storage().ref().child(this.course_words[i].sound);
        // set all urls sound in a array
        storageRefS.getDownloadURL().then(url => this.createSoundFile(this.soundUrl.push(url), i))
        let storageRefI = firebase.storage().ref().child(this.course_words[i].image);
        // set all urls image in a array
        if (this.course_words[i].image != "") {
          storageRefI.getDownloadURL().then(url => this.createImageFile(this.imgUrl.push(url), i))
          
        }
        else{
          this.createImageFile(this.imgUrl.push(''), i)

        }
      }
      //
     
    })

    this.sentencesService.getSentences(this.selectedCourse).valueChanges().subscribe(sentences => {
     // this.presentLoadingDefault()
      this.course_sentences = sentences
      this.file.createDir(this.file.externalDataDirectory, this.selectedCourse.id, true).then((data) => {
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
     // this.dismissLoadingDefault();
    })

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.platform.registerBackButtonAction(() => {

        //this.navCtrl.popToRoot();
        this.navCtrl.setRoot(ExercicesPage)
      });
    });
  }
  ionViewDidEnter(): void {

    this.content.resize()
  }
  openExo(exo) {

    // navigate to the new exo 
    this.navCtrl.push(exo.component, {
      course: this.selectedCourse,
      course_words: this.course_words,
      course_sentences: this.course_sentences

    });
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
        let course = this.selectedCourse.id + "/"
        console.log(course)
        let filepath = this.file.externalDataDirectory + this.selectedCourse.id
        console.log(filepath)
        let filename = ""

        if (this.selectedCourse.revision == true) {
          let reg = new RegExp('.*\/')
          filename = this.course_words[index].sound.replace(reg, "")
          console.log(filename)
        }
        else { filename = this.course_words[index].sound.replace(course, "") }
        console.log(filename)
        this.file.writeFile(filepath, filename, res)
      })
  }
  createSoundFileSentences(num: number, index: number) {

    let i = num - 1
    let url = this.soundSentencesUrl[num - 1]
    console.log(this.soundSentencesUrl[i])
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(res => {
        console.log(res)
        let course = this.selectedCourse.id + "/"
        console.log(course)
        let filepath = this.file.externalDataDirectory + this.selectedCourse.id
        console.log(filepath)
        let filename = ""
        if (this.selectedCourse.revision == true) {
          let reg = new RegExp('.*\/')
          filename = this.course_sentences[index].sound.replace(reg, "")
          console.log(filename)
        }
        else {
          filename = this.course_sentences[index].sound.replace(course, "")
          console.log(filename)
        }

        this.file.writeFile(filepath, filename, res)
        
      })
  }

  createImageFile(num: number, index: number) {
    console.log('index:'+index)
    console.log()
    console.log(this.course_words.length)
    console.log(this.imgUrl.length)
    let i = num - 1
    
    let url = this.imgUrl[num - 1]
    console.log(this.imgUrl[i])
    if(url!=''){}
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(res => {
        console.log(res)
        let course = this.selectedCourse.id + "/" + 'images/'
        console.log(course)
        let filepath = this.file.externalDataDirectory + this.selectedCourse.id
        console.log(filepath)
        let filename = ""
        if (this.selectedCourse.revision == true) {
          let reg = new RegExp('.*\/')
          filename = this.course_words[index].image.replace(reg, "")
          console.log(filename)
        }
        else {
          filename = this.course_words[index].image.replace(course, "")
        }
        console.log(filename)
        this.file.writeFile(filepath, filename, res)
      })
      if((index+1)==this.course_words.length)
      this.dismissLoadingDefault();
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