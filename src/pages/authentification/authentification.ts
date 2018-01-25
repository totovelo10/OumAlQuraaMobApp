import { Component, ViewChild } from '@angular/core';
import { SignupPage } from '../signup/signup';
import { CoursesPage } from '../../pages/courses/courses';
import { NewpassPage } from '../newpass/newpass';
import { NavController, NavParams, MenuController, Content,Platform } from 'ionic-angular';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { UsersService } from '../services/users.services';
import { User } from '../../interfaces/user'
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5/dist/md5';
@Component({
    selector: 'authentification',
    templateUrl: 'authentification.html',
    providers: [UsersService]
})
export class AuthentificationPage {
    @ViewChild(Content) content: Content;
    email: string
    pass: string
    errorMessage: string
    signupPage: SignupPage
    activeMenu: string;
    user: User

    constructor(private navCtrl: NavController,
        public navParams: NavParams,
        public menu: MenuController,
        public afAuth: AngularFireAuth,
        private usersServices: UsersService,
        public platform: Platform,
        private storage: Storage) {
        this.menu.enable(false)
        this.email = "";
        this.pass = "";
        this.errorMessage = ""

        this.storage.get('email_ceo').then((val) => {
            console.log( val);
            this.email=val
        })
        this.storage.get('mdp_ceo').then((val) => {
            this.pass=val
            this.login()
          })

          this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
      
            this.platform.registerBackButtonAction(() => {
      
              //this.navCtrl.popToRoot();
              this.navCtrl.setRoot(AuthentificationPage)
            });
          });
    }

    ionViewDidEnter(): void {

        this.content.resize()
    }
    inputFocus() {
        this.errorMessage = ""
    }

    goToSignup() {
        this.navCtrl.push(SignupPage)

    }
    goToNewPass() {
        this.navCtrl.push(NewpassPage)
    }
    login() {
        //let mdp= Md5.hashStr(this.pass).toString();
        this.afAuth.auth.signInWithEmailAndPassword(this.email, this.pass)
            .then((value) => {
                this.menu.enable(true)

               this.usersServices.getUserByEmail(this.email).valueChanges().subscribe(
                (user) => {
                    console.log(user)
                    this.user = user[0]
                    console.log(this.user.id)
                    this.storage.set('user', this.user);
                    this.storage.set('email_ceo',this.email)
                    let mdp= Md5.hashStr(this.pass).toString();
                    this.storage.set('mdp_ceo',this.pass)
                  }
               )
              
                this.navCtrl.setRoot(CoursesPage)
            })
            .catch((error) => {

                console.log(error)
                switch (error.code) {
                    case 'auth/invalid-email': this.errorMessage = "Le mail est invalide"; break
                    case 'auth/user-disabled': this.errorMessage = "L'utilisateur a été désactivé. Veuillez contacter l'administrateur"; break
                    case 'auth/user-not-found': this.errorMessage = "L'utilisateur n'existe pas"; break
                    case 'auth/wrong-password': this.errorMessage = "Le mot de passe est incorrect"; break
                    case 'auth/network-request-failed': this.errorMessage = "Votre connexion internet n'est actuellement pas suffisante pour l'application"
                }




            })


        // this.navCtrl.push(CoursesPage)

    }
}