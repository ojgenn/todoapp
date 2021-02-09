import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { AppUpdate } from '@ionic-native/app-update/ngx';
import { File } from '@ionic-native/file/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageModule } from './pages/home/home.module';
import { ShowTaskComponent } from './pages/home/task-list/show-task/show-task.component';
import { SharedModule } from './shared/shared.module';
import { TranslocoRootModule } from './transloco-root.module';

@NgModule({
    declarations: [
        AppComponent,
        ShowTaskComponent,
    ],
    entryComponents: [
        ShowTaskComponent,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot({
            mode: 'ios',
        }),
        AppRoutingModule,
        HttpClientModule,
        TranslocoRootModule,
        SharedModule,
        IonicStorageModule.forRoot(),
        HomePageModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        File,
        AppUpdate,
        LocalNotifications,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
