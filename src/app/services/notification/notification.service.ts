import { Injectable } from '@angular/core';
import { LocalNotifications, LocalNotificationSchema, LocalNotificationDescriptor } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  public async requestPermission(){
    await LocalNotifications.requestPermissions()
  }
  
  /**
   * Schedule a notification
   * @param id notification id
   * @param title notification title
   * @param body notification body
   */
  public async setNotifications(id: number, title: string, body: string) {
    const notifs = await LocalNotifications.schedule({
      notifications: [{
        title: title,
        body: body,
        id: id,
        schedule: { repeats: true, every: 'minute' },
        sound: undefined,
        attachments: undefined,
        actionTypeId: "",
        extra: null
      }]
    });
  }


  /**
   * Cancel a notification by id
   * @param id notification id
   */
  public async cancelNotifications(id : string){
    const notifications: LocalNotificationDescriptor[] = [{ id : parseInt(id) }];
    await LocalNotifications.cancel({notifications});
  }
}
