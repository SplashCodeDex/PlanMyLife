import { UserService } from './../user/user.service';
import { UiService } from './../ui/ui.service';
import { Injectable, inject } from '@angular/core';
import { Camera, CameraResultType, CameraSource, CameraPhoto } from '@capacitor/camera';
import { Storage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';
import { Auth, updateProfile } from '@angular/fire/auth';
import { AuthService } from '../auth/auth.service';
import { LoadingController } from '@ionic/angular';
import { UserData } from 'src/app/models/userData';


@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private storage = inject(Storage);
  private auth = inject(Auth);

  constructor(private uiService: UiService,
              private authService : AuthService,
              private userService: UserService,
              private loadingController: LoadingController) { }


  /**
   * Take a photo using device camera
   * and upload it to firebase storage
   */
  public async takePhoto(source : CameraSource) {
    try {
      var capturedPhoto = await Camera.getPhoto({
          resultType: CameraResultType.Base64,
          source: source,
          allowEditing: true,
          quality: 90
      })
      this.uploadPhoto(capturedPhoto)
    }
    catch (error){
      this.uiService.presentToast( "Failed to upload photo.", "danger", 3000)
      console.error(error);
    }
  }
  
  public async removePhoto(){
    const user = this.authService.getCurrentUser();
    if (user) {
      await updateProfile(user, {
        photoURL: 'https://images.assetsdelivery.com/compings_v2/2nix/2nix1408/2nix140800145.jpg'
      });
      const name = user.displayName;
      const email = user.email;
      const url = user.photoURL;
      this.userService.update(new UserData(name, email, url));
    }
  }

 /**
  * Upload a photo to the user's fire storage ref
  * then update user's data (photoURL) in firestore
  */
 async uploadPhoto(photo: CameraPhoto){
  const loading = await this.loadingController.create({ message: 'Please wait...'});
  await loading.present();

  try {
    const user = this.authService.getCurrentUser();
    if (!user || !photo.base64String) {
      throw new Error('User not authenticated or photo data missing');
    }

    const photoRef = ref(this.storage, 'profile/' + user.uid + '/profile_picture.jpg');
    await uploadString(photoRef, photo.base64String, 'base64', { contentType: 'image/jpg' });

    const url = await getDownloadURL(photoRef);

    await updateProfile(user, { photoURL: url });

    const name = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    this.userService.update(new UserData(name, email, photoURL));

    loading.dismiss();
    this.uiService.presentToast("Photo uploaded successfully.", "success", 3000);
  } catch (error) {
    loading.dismiss();
    this.uiService.presentToast("Failed to upload photo.", "danger", 3000);
    console.error(error);
  }
 }

}
