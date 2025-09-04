import {Injectable, inject} from '@angular/core';
import {List} from "../../models/list";
import {Todo} from "../../models/todo";
import {Firestore, collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, query, where, addDoc, getDocs} from "@angular/fire/firestore";
import { getFirestore } from "firebase/firestore";
import {combineLatest, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  constructor() {}

  /**
   *  Get all lists
   */
  public getAll() : Observable<List[]>{
    return new Observable(subscriber => {
      const userEmail = this.authService.getCurrentUser()?.email;
      if (!userEmail) {
        subscriber.next([]);
        return;
      }

      const listsQuery = query(
        collection(this.firestore, 'lists'),
        where('owner', '==', userEmail)
      );

      const unsubscribe = onSnapshot(listsQuery, (querySnapshot) => {
        const lists: List[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          lists.push({ id: doc.id, ...data } as List);
        });
        subscriber.next(lists);
      });

      return unsubscribe;
    });
  }

  /**
   *  Get all shared lists
   */
  public getAllShared() : Observable<List[]>{
    return new Observable(subscriber => {
      const userEmail = this.authService.getCurrentUser()?.email;
      if (!userEmail) {
        subscriber.next([]);
        return;
      }

      const readersQuery = query(
        collection(this.firestore, 'lists'),
        where('readers', 'array-contains', userEmail)
      );

      const writersQuery = query(
        collection(this.firestore, 'lists'),
        where('writers', 'array-contains', userEmail)
      );

      const readersLists: List[] = [];
      const writersLists: List[] = [];

      const unsubscribeReaders = onSnapshot(readersQuery, (querySnapshot) => {
        readersLists.length = 0; // Clear array
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          readersLists.push({ id: doc.id, ...data } as List);
        });
        emitCombined();
      });

      const unsubscribeWriters = onSnapshot(writersQuery, (querySnapshot) => {
        writersLists.length = 0; // Clear array
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          writersLists.push({ id: doc.id, ...data } as List);
        });
        emitCombined();
      });

      const emitCombined = () => {
        const combined = [...readersLists, ...writersLists];
        const unique = this.removeDuplicate(combined);
        subscriber.next(unique);
      };

      return () => {
        unsubscribeReaders();
        unsubscribeWriters();
      };
    });
  }

  /**
   *  Get a list by id
   */
  public getOne(id: string) : Observable<List | null>{
    return new Observable(subscriber => {
      const docRef = doc(this.firestore, 'lists', id);
      const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          subscriber.next({ id: docSnapshot.id, ...data } as List);
        } else {
          subscriber.next(null);
        }
      });
      return unsubscribe;
    });
  }

  /**
   *  Create a new list of todos
   */
  public async create(name: string, owner : string): Promise<void> {
    const listsCollection = collection(this.firestore, 'lists');
    const docRef = doc(listsCollection); // Auto-generates ID
    const list = new List(docRef.id, name, owner);
    await setDoc(docRef, Object.assign({}, list));
  }

  /**
   *  Delete a list of todos
   */
  public async delete(list : List) : Promise<void>{
    const docRef = doc(this.firestore, 'lists', list.id);
    await deleteDoc(docRef);
  }

  /**
   *  update a list
   */
  public async update(list : List) : Promise<void>{
    const docRef = doc(this.firestore, 'lists', list.id);
    await updateDoc(docRef, Object.assign({}, list) as any);
  }


  // ----------------------------------------------------------------------
  // ---------------------   TASK FUNCTIONS   -----------------------------
  // ----------------------------------------------------------------------

  /**
   *  Get firestore ref. of a task document
   */
  public getTodoRef(list_id:string, todo_id:string){
    return doc(this.firestore, 'lists', list_id, 'todos', todo_id);
  }

  /**
   *  Get all tasks corresponding to a list
   */
  public getAllTodos(list_id: string) : Observable<Todo[]>{
    return new Observable(subscriber => {
      const todosCollection = collection(this.firestore, 'lists', list_id, 'todos');
      const unsubscribe = onSnapshot(todosCollection, (querySnapshot) => {
        const todos: Todo[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          todos.push({ id: doc.id, ...data } as Todo);
        });
        subscriber.next(todos);
      });
      return unsubscribe;
    });
  }

  /**
   *  Get a task from a list by id
   */
  public getTodo(list_id: string, todo_id : string) : Observable<Todo | null>{
    return new Observable(subscriber => {
      const todoDoc = doc(this.firestore, 'lists', list_id, 'todos', todo_id);
      const unsubscribe = onSnapshot(todoDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          subscriber.next({ id: docSnapshot.id, ...data } as Todo);
        } else {
          subscriber.next(null);
        }
      });
      return unsubscribe;
    });
  }

  /**
   *  Add a new task to a list
   */
  public async addTodo(list: List, todo: Todo) {
    const todosCollection = collection(this.firestore, 'lists', list.id, 'todos');
    const docRef = doc(todosCollection); // Auto-generates ID
    todo.id = docRef.id;
    await setDoc(docRef, Object.assign({}, todo));

    const listDocRef = doc(this.firestore, 'lists', list.id);
    await updateDoc(listDocRef, {
      size: (list.size + 1)
    });
    list.size += 1;
    await this.updateProgress(list);
  }

  /**
   *  Remove a task from a list
   */
  public async deleteTodo(list: List, todo: Todo){
    const todoDocRef = doc(this.firestore, 'lists', list.id, 'todos', todo.id);
    await deleteDoc(todoDocRef);

    const listDocRef = doc(this.firestore, 'lists', list.id);
    await updateDoc(listDocRef, {
      size: (list.size - 1)
    });

    list.size -= 1;
    if(todo.isDone){
      list.nbChecked -= 1;
      await updateDoc(listDocRef, {
        nbChecked: list.nbChecked
      });
    }
    await this.updateProgress(list);
  }

  /**
   *  Update progress percentage of a list according to it's checked tasks
   */
  public async updateProgress(list :List){
    const progress = Math.floor((list.nbChecked / list.size) * 100);
    const listDocRef = doc(this.firestore, 'lists', list.id);
    await updateDoc(listDocRef, {
      progress: progress
    });
  }

  // ----------------------------------------------------------------------
  // ----------------------------  UTILS   --------------------------------
  // ----------------------------------------------------------------------

  /**
   *
   * @param actions
   * @returns
   */
  private singleMapper<T>(actions) {
    const data = actions.payload.data();
    const id = actions.payload.id;
    return { id, ...data} as T;
  }

  /**
   *
   * @param data
   * @returns
   */
  private multipleMapper<T>(data) {
    return data.map(d => {
      const id = d.payload.doc.id
      return { id, ...d.payload.doc.data() } as T;
    })
  }

  /**
   * Check whether a user has write permission on a list
   * @param list a list object
   * @param email
   * @returns true if the user had write permission, false otherwire
   */
  public hasWritePermission(list: List, email: string){
      if(list.owner == email || list.writers.includes(email))
        return true;
      else
        return false;
  }

  /**
   * Check whether a user has share permission on a list
   * @param list a list object
   * @param email
   * @returns true if the user had share permission, false otherwire
   */
  public hasSharePermission(list: List, email: string){
    if(list.owner == email || list.sharers.includes(email))
      return true;
    else
      return false;
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

}
