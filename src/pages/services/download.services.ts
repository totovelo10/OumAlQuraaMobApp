import { Injectable } from '@angular/core';
import { ExoParentPage } from '../exercices/exo-parent';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Course } from '../../interfaces/course';
import { Word } from '../../interfaces/word';
import { File } from '@ionic-native/file';
import * as firebase from 'firebase';
@Injectable()
export class DownloadService {

    result: any
    db: AngularFireDatabase
    ref: any
    soundWords: Array<any>;
    soundUrl = []
    imgUrl = []
    maxWords: number;
    course_words: any[];
    imageWords = []
    course_words_tmp: AngularFireList<Word[]>
    course: Course
    courseUnit: any
    wordsElement: any
    unitWords: Array<any>
    constructor(db: AngularFireDatabase,
        private file: File) {

        this.db = db;
        this.ref = firebase.database().ref
        this.unitWords=[]
    }

    downloadCourseElement(course): any {
        // we pass the selected this.course as navigation parameter
        this.course = course
        this.soundWords = [];
        let url = '/words/'
        let ref = firebase.database().ref
        console.log(this.course.id)
        // we select the words that have the this.course to true in the bdd
        this.db.list(url, ref => ref.orderByChild(course.id).equalTo(true)).valueChanges().subscribe(words => {
            console.log(words)
            this.course_words = words
            this.maxWords = words.length;

            this.file.createDir(this.file.externalDataDirectory, course.title, true).then((data) => {
                console.log(data)
            },
                (error) => { console.log(error) })


            //we retrive the sounds of all words
            for (let i = 0; i < this.maxWords; i++) {
                let crs_words = this.course_words
                console.log((this.course_words[i].sound))
                let storageRefS = firebase.storage().ref().child(this.course_words[i].sound);
                // set all urls sound in a array
                storageRefS.getDownloadURL().then(url => this.createSoundFile(course, this.soundUrl.push(url), i, crs_words))
                let storageRefI = firebase.storage().ref().child(this.course_words[i].image);
                // set all urls image in a array
                storageRefI.getDownloadURL().then(url => this.createImageFile(course, this.imgUrl.push(url), i, crs_words))

            }

            words.forEach(element => {
                element["answer"]=""
                
                this.unitWords.push(element)

            })
            console.log(this.unitWords)
        })


    }
    // unit is the wahda in the book of mecca it is a group of course
    downloadEvaluationElement(unit) {
        let url = '/courses/'
        this.db.list(url, ref => ref.orderByChild(unit).equalTo(true)).valueChanges().subscribe(courses => {
            console.log(courses)
            this.courseUnit = courses
            this.courseUnit.forEach(element => {
                console.log(element)
                this.downloadCourseElement(element)
                this.course_words = []
            });
        }
        )
        return this.unitWords
    }


    createSoundFile(tcourse: any, num: number, index: number, crs_words: any) {
        //this.course=course
        console.log(this.course_words.length)
        console.log(this.soundUrl.length)
        let i = num - 1
        let url = this.soundUrl[num - 1]
        console.log(this.soundUrl[i])
        fetch(url)
            .then(res => res.blob())
            .then(res => {
                console.log(res)
                let courseid = tcourse.id + "/"
                console.log(courseid)
                let filepath = this.file.externalDataDirectory + tcourse.title
                console.log(filepath)
                let filename = crs_words[index].sound.replace(courseid, "")
                console.log(filename)
                this.file.writeFile(filepath, filename, res)
            })
    }

    createImageFile(tcourse: any, num: number, index: number, crs_words: any) {
        //this.course=course
        console.log(this.course_words.length)
        console.log(this.imgUrl.length)
        let i = num - 1
        let url = this.imgUrl[num - 1]
        console.log(this.imgUrl[i])
        fetch(url)
            .then(res => res.blob())
            .then(res => {
                console.log(res)
                let courseid = tcourse.id + "/" + 'images/'
                console.log(courseid)
                let filepath = this.file.externalDataDirectory + tcourse.title
                console.log(filepath)
                let filename = crs_words[index].image.replace(courseid, "")
                console.log(filename)
                this.file.writeFile(filepath, filename, res)
            })
    }
}