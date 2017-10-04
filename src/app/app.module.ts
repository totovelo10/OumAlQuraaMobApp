import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
//import { AngularFireStorageModule } from 'angularfire2/storage';
import { MyApp } from './app.component';


import { CoursesPage } from '../pages/courses/courses';
import { DictationWordsPage } from '../pages/exercices/dictation-words/dictation-words';
import { CourseDetailsPage } from '../pages/course-details/course-details';
// import exercices pages
import { ExercicesPage } from '../pages/exercices/exercices';
import { ExercicesCoursesPage } from '../pages/exercices/exercices-courses/exercices-courses';
import { FrenchToArabicPage } from '../pages/exercices/french-to-arabic/french-to-arabic';
import { ArabicToFrenchPage } from '../pages/exercices/arabic-to-french/arabic-to-french';
import { ImageToArabicPage } from '../pages/exercices/image-to-arabic/image-to-arabic';
import { SoundWordsToFrenchPage } from '../pages/exercices/sound-words-to-french/sound-words-to-french';

// import results page
import { ResultsPage } from '../pages/exercices/results/results'
//import correction page
import { CorrectionFrenchToArabicPage } from '../pages/corrections/french-to-arabic/correction-french-to-arabic';
import { CorrectionArabicToFrenchPage } from '../pages/corrections/arabic-to-french/correction-arabic-to-french';
import { CorrectionImageToArabicPage } from '../pages/corrections/image-to-arabic/correction-image-to-arabic';
import { CorrectionSoundWordsToFrenchPage } from '../pages/corrections/sound-words-to-french/correction-sound-words-to-french';
import { CorrectionDictationWordsPage } from '../pages/corrections/dictation-words/correction-dictation-words';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeAudio } from '@ionic-native/native-audio';

import 'firebase/database';
import 'firebase/app';
import 'firebase/storage'

import { firebaseConfig } from '../environments/firebaseconfig';

@NgModule({
  declarations: [
    MyApp,
    CoursesPage,
    CourseDetailsPage,
    ExercicesPage,
    ExercicesCoursesPage,
    FrenchToArabicPage,
    ArabicToFrenchPage,
    ImageToArabicPage,
    SoundWordsToFrenchPage,
    DictationWordsPage,
    ResultsPage,
    CorrectionFrenchToArabicPage,
    CorrectionArabicToFrenchPage,
    CorrectionImageToArabicPage,
    CorrectionSoundWordsToFrenchPage,
    CorrectionDictationWordsPage
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig.firebase),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CoursesPage,
    CourseDetailsPage,
    ExercicesPage,
    ExercicesCoursesPage,
    FrenchToArabicPage,
    ArabicToFrenchPage,
    ImageToArabicPage,
    SoundWordsToFrenchPage,
    DictationWordsPage,
    ResultsPage,
    CorrectionFrenchToArabicPage,
    CorrectionArabicToFrenchPage,
    CorrectionImageToArabicPage,
    CorrectionSoundWordsToFrenchPage,
    CorrectionDictationWordsPage
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeAudio,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
