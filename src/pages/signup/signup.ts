import { Component, Inject } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { Md5 } from 'ts-md5/dist/md5';
import * as firebase from 'firebase/app';

@Component({
    selector: 'signup',
    templateUrl: 'signup.html'
})

export class SignupPage {
    lastname: string
    firstname: string
    kunya: string
    email: string
    pass: string
    confirmpass: string
    errorMessage: string
    accountcreated: boolean
    url: string
    userId: any
    constructor(db: AngularFireDatabase) {
        this.firstname = ""
        this.lastname = ""
        this.kunya = ""
        this.email = "";
        this.pass = "";
        this.confirmpass = "";
        this.url = ""
        this.accountcreated = false

    }

    createUser() {
        try {
            if (this.pass != this.confirmpass) throw "Les mots de passe ne correspondent pas."
            firebase.auth().createUserWithEmailAndPassword(this.email, this.pass)
                .then(
                () => {
                    this.accountcreated = true
                    let mdp = Md5.hashStr(this.pass);
                    let userId = firebase.database().ref('users').push({
                        email: this.email,
                        firstname: this.firstname,
                        lastname: this.lastname,
                        kunya: this.kunya,
                        password: mdp,
                        id:""
                    })
                   //userId contains the url to the data
                    this.url = 'users/'+userId.key
                    this.userId = userId.key;
                    console.log(this.url)
                    console.log(this.userId)
                   this.updateUserId()
                })
                .catch((error) => {

                    console.log(error)
                    switch (error.code) {
                        case 'auth/email-already-in-use': this.errorMessage = "Le compte existe déjà"; break
                        case 'auth/invalid-email': this.errorMessage = "L'email n'est pas valide"; break
                        case 'auth/weak-password': this.errorMessage = "Le mot de passe est trop faible"; break
                    }




                })

           
        }
        // catch error if confirmpass!= pass
        catch (error) {
            this.errorMessage = error
        }
    }

    updateUserId(){
        firebase.database().ref(this.url).update({ id: this.userId })
        .catch((error) =>{
            console.log(error)
        })
    }

}