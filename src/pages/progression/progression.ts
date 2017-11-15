import { Component, ViewChild } from '@angular/core';
import { ResultsService } from '../services/results.services';
import { User } from '../../interfaces/user'
import { Result } from '../../interfaces/result'
import { Content } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'progression',
  templateUrl: 'progression.html',
  providers: [ResultsService]
})
export class ProgressionPage {
  user: User
  result: Array<Result>
  @ViewChild(Content) content: Content;

  constructor(private resultsServices: ResultsService,
    private storage: Storage) {
      this.user= {id:"",email:"",firstname:"",lastname:"",kunya:""}
      this.storage.get('user').then((user) => {
        if (user !== null) {
          this.user = user
          this.resultsServices.getResultByUserId(user.id).valueChanges().subscribe(
            result => {
              this.result = result
            }
          )
        }
      }
      )

  }
  //refresh the content size
  ionViewDidEnter(): void {

    this.content.resize()
   

  }


}