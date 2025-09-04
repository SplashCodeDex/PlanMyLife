import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import {BehaviorSubject, Observable} from "rxjs";
import {Settings} from "../../models/settings";
import {StorageService} from "../storage/storage.service";

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  darkMode : BehaviorSubject<boolean>;
  secureUnlock : BehaviorSubject<boolean>;
  deleteConfirm : BehaviorSubject<boolean>;
  pushNotification : BehaviorSubject<boolean>;

  object : BehaviorSubject<Settings>

  constructor(private storageService: StorageService) {
     this.object = new BehaviorSubject<Settings>(new Settings());
     this.userSettings('settings')
  }

  userSettings(key : string){
    this.storageService.getObject(key).then(value => {
      if(value){
        this.object.next(value)
        if (this.object.getValue().darkMode){
          document.body.setAttribute('color-theme', 'dark');
          if(Capacitor.isPluginAvailable('StatusBar'))
            StatusBar.setStyle({style: Style.Dark});
        }
        else{
          document.body.setAttribute('color-theme', 'light');
          if(Capacitor.isPluginAvailable('StatusBar'))
            StatusBar.setStyle({style: Style.Light});
        }
      }
      else{
        this.storageService.setObject(key, new Settings())
        this.object.next(new Settings())
      }
    })
  }


  /**
   * Setter for settings object
   * @param newValue : object of type settings
   */
  setSettings(newValue): void {
    this.storageService.setObject('settings', newValue)
    this.object.next(newValue);
    if (newValue.darkMode){
      document.body.setAttribute('color-theme', 'dark');
      if(Capacitor.isPluginAvailable('StatusBar'))
        StatusBar.setStyle({style: Style.Dark});
    }
    else{
      document.body.setAttribute('color-theme', 'light');
      if(Capacitor.isPluginAvailable('StatusBar'))
        StatusBar.setStyle({style: Style.Light});
    }
      
  }


  /**
   * Get settings values as an object
   */
  getValues(){
    return this.object.getValue()
  }

  /**
   * Get settings as an observable of object
   */
  getSettings(): Observable<Settings> {
    return this.object.asObservable();
  }
}
