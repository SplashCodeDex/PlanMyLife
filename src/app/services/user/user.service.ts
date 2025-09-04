import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, updateDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable, combineLatest} from 'rxjs';
import { map } from 'rxjs/operators';
import { List } from 'src/app/models/list';
import { UserData } from 'src/app/models/userData';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);
  private usersCollection = collection(this.firestore, 'users');
  public users : UserData[]

  constructor() {
    this.getAll().subscribe(value => this.users = value)
  }


 /**
  *  Get all users (members) of a list
  */
 public getAll() : Observable<UserData[]>{
   return new Observable(subscriber => {
     const unsubscribe = onSnapshot(this.usersCollection, (querySnapshot) => {
       const users: UserData[] = [];
       querySnapshot.forEach((docSnapshot) => {
         const data = docSnapshot.data();
         users.push({ id: docSnapshot.id, ...data } as UserData);
       });
       subscriber.next(users);
     });
     return unsubscribe;
   });
}

  public getUserByEmail(email: string) : UserData{
    return this.users.find(user => user.email === email)
  }


  /**
 * Remove duplicated values in an array
 * @param data the array of object
 * @returns new array without duplicates
 */
  private removeDuplicate(data){
    let array = data.reduce((arr, item) => {
      let exists = !!arr.find(x => x.id === item.id);
      if(!exists){
        arr.push(item);
      }
      return arr;
    }, []);

    return array
  }


  /**
   *  update a user's data in firestore
   */
  public update(data : UserData) : void{
    const userDoc = doc(this.firestore, 'users', data.email);
    updateDoc(userDoc, Object.assign({}, data));
  }

}
