import { Component } from '@angular/core';
import {SignupPage} from '../signup/signup';
import {CoursesPage} from '../../pages/courses/courses';
import {NewPassPage} from '../newpass/newpass';
import { NavController, NavParams,MenuController} from 'ionic-angular';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';

@Component({
    selector: 'authentification',
    templateUrl: 'authentification.html'
  })
  export class AuthentificationPage {

    email:string
    pass:string
    errorMessage:string
    signupPage:SignupPage
    activeMenu: string;
    constructor(private navCtrl:NavController, 
        public navParams: NavParams,
        public menu: MenuController,
        public afAuth: AngularFireAuth) {
        this.menu.enable(false)
        this.email="";
        this.pass="";
        this.errorMessage=""
        }
        inputFocus(){
            this.errorMessage=""
        }

        goToSignup(){
            this.navCtrl.push(SignupPage)
            
        }
        goToNewPass(){
            this.navCtrl.push(NewPassPage)
        }
        login(){
            this.afAuth.auth.signInWithEmailAndPassword(this.email,this.pass)
            .then((value) =>{
                 this.menu.enable(true)
                this.navCtrl.setRoot(CoursesPage)
            })
            .catch((error) =>{

                console.log(error)
                switch(error.code){
                    case 'auth/invalid-email': this.errorMessage="Le mail est invalide";break
                    case 'auth/user-disabled': this.errorMessage="L'utilisateur a été désactivé. Veuillez contacter l'administrateur";break
                    case 'auth/user-not-found': this.errorMessage="L'utilisateur n'existe pas";break
                    case 'auth/wrong-password': this.errorMessage="Le mot de passe est incorrect";break
                }
                
                    
                

           })
             
              
             // this.navCtrl.push(CoursesPage)
              
        }
  }