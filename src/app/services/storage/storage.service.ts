import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * Store an object in local storage
   * @param key
   * @param value
   */
  async setObject(key : string, value: any){
    await Preferences.set({
      key: key,
      value: JSON.stringify(value)
    });
  }

  /**
   * Retreive an object from local storage by key
   * @param key
   */
  async getObject(key: string){
    const item = await Preferences.get({ key: key });
    return item.value ? JSON.parse(item.value) : null;
  }
}
