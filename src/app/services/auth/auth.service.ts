import { UserData } from '../../models/userData';
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithCredential, sendPasswordResetEmail, signOut, onAuthStateChanged, updateProfile, sendEmailVerification } from "@angular/fire/auth";
import { Firestore, collection, doc, setDoc, onSnapshot } from "@angular/fire/firestore";
import {ModalController, AlertController, LoadingController, NavController} from "@ionic/angular";
import {UiService} from "../ui/ui.service";
import {Router} from "@angular/router";
import { SocialLogin } from '@capgo/capacitor-social-login';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { User, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private user: User | null = null;

    constructor(private auth: Auth,
                private firestore: Firestore,
                private navController: NavController,
                private modalController: ModalController,
                private loadingController: LoadingController,
                private uiService: UiService,
                private alertCtrl : AlertController,
                private router: Router) {
        this.authStatusListener();
    }


    authStatusListener(){
        onAuthStateChanged(this.auth, (credential)=>{
            if(credential)
                this.user = credential
            else
                this.user = null
        })
    }

    /**
     * Sign up with email & password using firebase
     * @param name user's full name
     * @param email user's email
     * @param password user's password
     */
    public async createAccount(name: string, email: string, password: string) {
        const loading = await this.loadingController.create({ message: 'Please wait...'});
        await loading.present()
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            loading.dismiss()
            await sendEmailVerification(userCredential.user);
            // Note: additionalUserInfo is not available in the new API
            // We'll need to check if user exists in a different way
            const data = new UserData(name, email, '')
            const userDoc = doc(this.firestore, 'users', userCredential.user.email!);
            await setDoc(userDoc, Object.assign({}, data));
            await updateProfile(userCredential.user, {
                displayName: name
            })
            await signOut(this.auth);
            this.uiService.presentToast( " Account created successfully.", "success", 3000)
            this.navController.navigateBack('login')
        } catch (error: any) {
            loading.dismiss()
            this.uiService.presentToast( error.message, "danger", 3000)
        }
    }


    /**
     * Sign in with email & password using firebase
     * @param email user's email
     * @param password user's password
     */
    public async signWithEmail(email: string, password: string) {
        const loading = await this.loadingController.create({ message: 'Please wait...'});
        await loading.present()
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            loading.dismiss()
            if(userCredential.user.emailVerified){
                this.uiService.presentToast( "Connected successfully.", "success", 3000);
                this.router.navigate(['/home'])
            }else{
                await signOut(this.auth);
                this.uiService.presentToast( "Please verify your mail address.", "danger", 3000)
            }
        } catch (error: any) {
            loading.dismiss()
            this.uiService.presentToast( error.message, "danger", 3000)
        }
    }


    /**
     * Login with Google
     */
    async signWithGoogle(){
        const loading = await this.loadingController.create({ message: 'Please wait...'});
        try {
            const result = await SocialLogin.login({
              provider: 'google',
              options: {} // Add an empty options object
            });
            if (result.result && (result.result as any).idToken) { // Check for result.result and idToken
                const credential = GoogleAuthProvider.credential((result.result as any).idToken);
                await loading.present()
                const userCredential = await signInWithCredential(this.auth, credential);
                // Note: additionalUserInfo is not available in the new API
                const data = new UserData(userCredential.user.displayName || '', userCredential.user.email || '', userCredential.user.photoURL || '')
                const userDoc = doc(this.firestore, 'users', userCredential.user.email!);
                await setDoc(userDoc, Object.assign({}, data));
                loading.dismiss()
                this.uiService.presentToast( "Connected successfully.", "success", 3000);
                this.router.navigate(['/home'])
            } else {
                loading.dismiss()
            }
        } catch (error: any) {
            loading.dismiss()
            this.uiService.presentToast( error.message, "danger", 3000)
        }
    }

    /**
     * Login with Facebook : first of all, we use FacebookLogin to signin
     * then we use the access token as a credential to signin using firebase
     */
    public async signWithFacebook(){
        try {
            const loading = await this.loadingController.create({ message: 'Please wait...'})
            const result = await FacebookLogin.login({ permissions: ['email', 'public_profile'] });

            if (result && result.accessToken) {
                const credential = FacebookAuthProvider.credential(result.accessToken.token);
                await loading.present()
                const userCredential = await signInWithCredential(this.auth, credential);
                // Note: updateProfile and additionalUserInfo are not available in the new API
                const data = new UserData(userCredential.user.displayName || '', userCredential.user.email || '', userCredential.user.photoURL || '')
                const userDoc = doc(this.firestore, 'users', userCredential.user.email!);
                await setDoc(userDoc, Object.assign({}, data));
                loading.dismiss()
                this.uiService.presentToast( "Connected successfully.", "success", 3000);
                this.router.navigate(['/home'])
            }
        } catch (error: any) {
            this.uiService.presentToast( error.message, "danger", 3000)
        }
    }

    /**
     * Login with Apple
     */
    public async signWithApple(){
        const alert = await this.alertCtrl.create({
            header: 'Coming soon 🚧',
            message: 'This feature will be provided soon',
            buttons: ['OK']
            });
        await alert.present();
    }

    /**
     * Reset user passwork
     * @param email user email
     */
    public async resetPassword(email: string){
        const loading = await this.loadingController.create({ message: 'Please wait...'});
        await loading.present()
        try {
            await sendPasswordResetEmail(this.auth, email);
            await loading.dismiss()
            this.modalController.dismiss();
            this.uiService.presentToast("Reset email sent successfully.", "success", 4000);
        } catch (error) {
            await loading.dismiss()
            this.uiService.presentToast( "An error occurred, please try again.", "danger", 4000)
        }
    }

    /**
     * Log out
     */
    public async logout() {
        try {
            await SocialLogin.logout({ provider: 'google' });
            await FacebookLogin.logout();
            await signOut(this.auth);
            this.uiService.presentToast( "Logged out successfully.", "success", 3000);
            this.router.navigate(['/login'])
        } catch (error) {
            this.uiService.presentToast( "An error occurred, please try again.", "danger", 4000)
        }
    }

    /**
     * the current state of the user
     * @returns a User object
     */
    public getCurrentUser(){
        return this.user
    }

    /**
     * Get user's data from firestore
     * @param email : user's email
     * @returns
     */
    public getOne(email: string) : Observable<any>{
        return new Observable(subscriber => {
            const userDoc = doc(this.firestore, 'users', email);
            const unsubscribe = onSnapshot(userDoc, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const id = docSnapshot.id;
                    subscriber.next({ id, ...data });
                } else {
                    subscriber.next(null);
                }
            });
            return unsubscribe;
        });
    }
}