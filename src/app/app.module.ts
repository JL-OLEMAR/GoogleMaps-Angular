import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component'
import { MapaComponent } from './components/mapa/mapa.component'

@NgModule({
  declarations: [
    AppComponent,
    MapaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
