import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigatorComponent } from './layout/navigator/navigator.component';
import { NoticeboardComponent } from './layout/noticeboard/noticeboard.component';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/main/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { WEB3PROVIDER } from './utils/web3-provider';
import detectEthereumProvider from '@metamask/detect-provider';
import { Web3Service } from './utils/services/web3service';


export function enableWeb3Provider(_provider: any) {
  return () => {
    detectEthereumProvider();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    NavigatorComponent,
    NoticeboardComponent,
    MainComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: enableWeb3Provider,
      deps: [WEB3PROVIDER],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
