import { Component, Inject } from '@angular/core'
import { FirebaseApp } from 'angularfire2'
import * as firebase from 'firebase/app';

@Component({
    selector: 'signup',
    templateUrl: 'signup.html'
})

export class SignupPage {

    email: string
    pass: string
    confirmpass: string
    errorMessage: string
    accountcreated: boolean
    constructor( @Inject(FirebaseApp) firebaseApp: any) {
        this.email = "";
        this.pass = "";
        this.confirmpass = "";
        this.accountcreated = false
    }

    createUser() {
        if (this.pass != this.confirmpass) {
            this.errorMessage = "Les mots de passe ne correspondent pas."
        }
        console.log(this.email)
        console.log(this.pass)
        firebase.auth().createUserWithEmailAndPassword(this.email, this.pass)
            .then(() => this.accountcreated = true)
            .catch((error) => {

                console.log(error)
                switch (error.code) {
                    case 'auth/email-already-in-use': this.errorMessage = "Le compte existe déjà"; break
                    case 'auth/invalid-email': this.errorMessage = "L'email n'est pas valide"; break
                    case 'auth/weak-password': this.errorMessage = "Le mot de passe est trop faible"; break
                }




            })

    }

}