import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
//import { AngularFireStorageModule } from 'angularfire2/storage';
import { MyApp } from './app.component';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { CoursesPage } from '../pages/courses/courses';
import { CourseDetailsPage } from '../pages/course-details/course-details';
// import exercices pages
import { ExercicesPage } from '../pages/exercices/exercices';
import { ExercicesCoursesPage } from '../pages/exercices/exercices-courses/exercices-courses';
import { FrenchToArabicPage } from '../pages/exercices/french-to-arabic/french-to-arabic';

// import results page
import { ResultsPage } from '../pages/exercices/results/results'
//import correction page
import { CorrectionFrenchToArabicPage } from '../pages/corrections/french-to-arabic/correction-french-to-arabic';
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
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    CoursesPage,
    CourseDetailsPage,
    ExercicesPage,
    ExercicesCoursesPage,
    FrenchToArabicPage,
    ResultsPage,
    CorrectionFrenchToArabicPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig.firebase),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    CoursesPage,
    CourseDetailsPage,
    ExercicesPage,
    ExercicesCoursesPage,
    FrenchToArabicPage,
    ResultsPage,
    CorrectionFrenchToArabicPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeAudio,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
