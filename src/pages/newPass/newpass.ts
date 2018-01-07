import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthentificationPage } from '../authentification/authentification';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
@Component({
    selector: 'newpass',
    templateUrl: 'newpass.html'
  })
  export class NewPassPage {

    email:string
    emailsent:boolean
    constructor(public afAuth: AngularFireAuth,
      private navCtrl: NavController,
        public navParams: NavParams) {
        this.email="";
        this.emailsent=false
        }

        validate(){
          this.afAuth.auth.useDeviceLanguage()
          this.afAuth.auth.sendPasswordResetEmail(this.email).then(function() {
            // Email sent.
            this.emailsent=true
            console.log("email sent to: "+this.email)
          }).catch(function(error) {
            // An error happened.
          });
        }

        backtologinpage(){
          this.navCtrl.push(AuthentificationPage)
        }
  }