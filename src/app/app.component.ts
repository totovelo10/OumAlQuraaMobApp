import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav,AlertController   } from 'ionic-angular';

//import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';

import { CoursesPage } from '../pages/courses/courses';
import { AuthentificationPage } from '../pages/authentification/authentification';
import { ExercicesPage } from '../pages/exercices/exercices';
import { ProgressionPage} from '../pages/progression/progression';
//import { EvaluationPage} from '../pages/evaluation/evaluation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { FCM } from '@ionic-native/fcm';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  alert:AlertController
  rootPage = AuthentificationPage;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    private file: File,
    private storage: Storage,
    public push: Push, 
    //private fcm: FCM
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [

      { title: 'Cours', component: CoursesPage },
      { title: 'Exercices', component: ExercicesPage },
      { title: 'Progression',component: ProgressionPage},
     // { title: 'Evaluation',component: EvaluationPage},
      { title: 'Se déconnecter', component: AuthentificationPage }
     
    ];
  }

  initializeApp() {
    
    /*this.fcm.onNotification().subscribe(data=>{
      if(data.wasTapped){
        console.log("Received in background");
        alert(JSON.stringify(data) )
        console.log(data)
      } else {
       console.log("Received in foreground");
        data.wasTapped=true
        if(data.wasTapped)
        alert(JSON.stringify(data))
        
      };
    })*/
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
     
      this.pushsetup();
      /*this.platform.registerBackButtonAction(() => {
        if(this.nav.canGoBack()){
          this.nav.pop();
        }else{
            this.showAlert();
           }
        
      });*/

   
    });

 
 
  }

  
  pushsetup() {
    const options: PushOptions = {
     android: {
         senderID: '252599887617',
         iconColor: "green"
     },
     ios: {
         alert: 'true',
         badge: true,
         sound: 'false'
     },
     windows: {}
  };
  const pushObject: PushObject = this.push.init(options);
 
  pushObject.on('notification').subscribe((notification: any) => {
    if (notification.additionalData.foreground) {
      console.log("noti "+ notification)
      let youralert = this.alertCtrl.create({
        title:notification.title,
        message: notification.message,
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
              youralert =null;
            }
          }],
          //cssClass:'customLoader'
        
      });
      youralert.present();
    }
  });
 
  pushObject.on('registration').subscribe((registration: any) => {
   // alert(registration.registrationId);
  });
 
  pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
  }


  openPage(page) {
  
    // close the menu when clicking a link from the menu
    this.menu.close();
    console.log(page)
    // navigate to the new page if it is not the current page
    if(page.component ==  AuthentificationPage){
      console.log("we get out")
      // the user is deconnected so we break the auto connect
      this.storage.remove('email_ceo').then((val)=>{
        console.log(val)})
      this.storage.remove('mdp_ceo').then((val)=>{console.log(val)})
      this.menu.enable(false)
      
    }
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
