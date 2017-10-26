import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav,AlertController   } from 'ionic-angular';

//import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';

import { CoursesPage } from '../pages/courses/courses';
import { ExercicesPage } from '../pages/exercices/exercices';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  alert:AlertController
  rootPage = CoursesPage;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    private file: File
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [

      { title: 'Cours', component: CoursesPage },
      { title: 'Exercices', component: ExercicesPage }
     
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      /*this.platform.registerBackButtonAction(() => {
        if(this.nav.canGoBack()){
          this.nav.pop();
        }else{
            this.showAlert();
           }
        
      });*/

   
    });

   
 
  }

  

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Exit?',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            alert =null;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present();
  }

}
