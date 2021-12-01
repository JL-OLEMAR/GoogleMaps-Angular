import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'

import { AppComponent } from './app.component'
import { MapaComponent } from './components/mapa/mapa.component'

const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} }

@NgModule({
  declarations: [
    AppComponent,
    MapaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
