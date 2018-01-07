import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
// import angularfire modules
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { MyApp } from './app.component';
import {ExoParentPage} from '../pages/exercices/exo-parent'
import { CoursesPage } from '../pages/courses/courses';
import { DictationWordsPage } from '../pages/exercices/dictation-words/dictation-words';
import { CourseDetailsPage } from '../pages/course-details/course-details';


// import authentification and signup page
import { AuthentificationPage } from '../pages/authentification/authentification';
import { SignupPage } from '../pages/signup/signup';
import { NewPassPage } from '../pages/newpass/newpass';
// import exercices pages

import { ExercicesPage } from '../pages/exercices/exercices';
import { ExercicesCoursesPage } from '../pages/exercices/exercices-courses/exercices-courses';

import { FrenchToArabicPage } from '../pages/exercices/french-to-arabic/french-to-arabic';
import { ArabicToFrenchPage } from '../pages/exercices/arabic-to-french/arabic-to-french';
import { RecognizeSoundsPage } from '../pages/exercices/recognize-sounds/recognize-sounds';
import { ImageToArabicPage } from '../pages/exercices/image-to-arabic/image-to-arabic';
import { SoundWordsToFrenchPage } from '../pages/exercices/sound-words-to-french/sound-words-to-french';
//import { FillGapsPage } from '../pages/exercices/fillgaps/fillgaps';
import { CorrectSentencesPage } from '../pages/exercices/correct-sentences/correct-sentences';
// import results page
import { ResultsPage } from '../pages/exercices/results/results'
//import correction page
import { CorrectionFrenchToArabicPage } from '../pages/corrections/french-to-arabic/correction-french-to-arabic';
import { CorrectionArabicToFrenchPage } from '../pages/corrections/arabic-to-french/correction-arabic-to-french';
import { CorrectionImageToArabicPage } from '../pages/corrections/image-to-arabic/correction-image-to-arabic';
import { CorrectionSoundWordsToFrenchPage } from '../pages/corrections/sound-words-to-french/correction-sound-words-to-french';
import { CorrectionDictationWordsPage } from '../pages/corrections/dictation-words/correction-dictation-words';
import { CorrectionCorrectSentencesPage } from '../pages/corrections/correct-sentences/correction-correct-sentences';
// Progression
import{ProgressionPage} from '../pages/progression/progression';
// Evaluation
import { EvaluationPage } from '../pages/evaluation/evaluation';
//import native and extern plugin
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeAudio } from '@ionic-native/native-audio';
import { Media} from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { IonicStorageModule } from '@ionic/storage';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import 'firebase/database';
import 'firebase/app';
import 'firebase/storage'
import { firebaseConfig } from '../environments/firebaseconfig';

@NgModule({
  declarations: [
    MyApp,
    AuthentificationPage,
    ExoParentPage,
    ExercicesCoursesPage,
    ArabicToFrenchPage,
    FrenchToArabicPage,
    ImageToArabicPage,
    SoundWordsToFrenchPage,
    CoursesPage,
    CourseDetailsPage,
    ExercicesPage,
    DictationWordsPage,
    CorrectSentencesPage,
    ResultsPage,
    CorrectionFrenchToArabicPage,
    CorrectionArabicToFrenchPage,
    CorrectionImageToArabicPage,
    CorrectionSoundWordsToFrenchPage,
    CorrectionDictationWordsPage,
    CorrectionCorrectSentencesPage,
    SignupPage,
    NewPassPage,
    ProgressionPage,
    EvaluationPage,
    RecognizeSoundsPage
    
    
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AuthentificationPage,
    ExoParentPage,
    ExercicesCoursesPage,
    ArabicToFrenchPage,
    FrenchToArabicPage,
    ImageToArabicPage,
    SoundWordsToFrenchPage,
    CoursesPage,
    CourseDetailsPage,
    ExercicesPage,
    DictationWordsPage,
    CorrectSentencesPage,
    ResultsPage,
    CorrectionFrenchToArabicPage,
    CorrectionArabicToFrenchPage,
    CorrectionImageToArabicPage,
    CorrectionSoundWordsToFrenchPage,
    CorrectionDictationWordsPage,
    CorrectionCorrectSentencesPage,
    SignupPage,
    NewPassPage,
    ProgressionPage,
    EvaluationPage,
    RecognizeSoundsPage
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeAudio,
    Media, 
    File,
    SpeechRecognition,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
