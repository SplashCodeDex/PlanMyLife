import { Component, inject, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { RouterOutlet } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { AuthService } from './services/auth/auth.service';
import { UiService } from './services/ui/ui.service';
import { NotificationService } from './services/notification/notification.service';
import { Capacitor } from '@capacitor/core';
import { FacebookLogin } from '@capacitor-community/facebook-login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, RouterOutlet],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  private platform = inject(Platform);
  private uiService = inject(UiService);
  private authService = inject(AuthService);
  private notifService = inject(NotificationService);

  ngOnInit() {
    this.initializeApp();
    this.notifService.requestPermission();
  }

  private async initializeApp() {
    await this.platform.ready();

    // Initialize network listener
    const { Network } = await import('@capacitor/network');
    Network.addListener('networkStatusChange', (status) => {
      if (status.connected) {
        this.uiService.presentToast('Network connection established successfully', 'success', 5000);
      } else {
        this.uiService.presentToast('The network connection was lost', 'danger', 5000);
      }
    });

    // Initialize status bar
    if (Capacitor.isPluginAvailable('StatusBar')) {
      const { StatusBar, Style } = await import('@capacitor/status-bar');
      const theme = document.body.getAttribute('color-theme');
      await StatusBar.setStyle({
        style: theme === 'dark' ? Style.Dark : Style.Light
      });
      await StatusBar.show();
    }

    // Hide splash screen
    if (Capacitor.isPluginAvailable('SplashScreen')) {
      const { SplashScreen } = await import('@capacitor/splash-screen');
      await SplashScreen.hide();
    }
  }

  logout() {
    this.authService.logout();
  }

  async openBrowser(url: string) {
    const { Browser } = await import('@capacitor/browser');
    await Browser.open({ url });
  }

  async shareToApps() {
    const { Share } = await import('@capacitor/share');
    await Share.share({
      title: 'Firetask : a shared todolist app',
      text: 'Really awesome app you need to see right now',
      url: 'https://github.com/chouaibMo/ionic-todolist-app',
      dialogTitle: 'Share with buddies'
    });
  }
}
